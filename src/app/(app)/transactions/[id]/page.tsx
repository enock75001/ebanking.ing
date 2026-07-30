"use client";

import { useParams, useRouter } from "next/navigation";
import { useDoc, useMemoFirebase, useFirestore, useUser, deleteDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { 
  ShieldAlert, 
  ArrowLeft, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Info,
  Lock,
  Building2,
  AlertCircle,
  Trash2,
  FileDown,
  ChevronRight,
  ExternalLink,
  Printer,
  Share2,
  Globe,
  MapPin,
  Landmark,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function TransactionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const userId = user?.uid;
  const bankAccountId = "be31-3401-8410-7755";

  const mockBnpTransaction = {
    id: "trx-bnp-3180000",
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    transactionType: "Deposit",
    amount: 3180000.00,
    totalAmount: 3180000.00,
    fee: 0,
    description: "Virement SEPA reçu de BNP PARIBAS",
    status: "Completed",
    beneficiaryName: "BNP PARIBAS",
    beneficiaryBankName: "BNP PARIBAS SA",
    beneficiaryIban: "FR76 3000 4028 3700 0000 0000 000",
    beneficiaryBic: "BNPAFRPP",
    beneficiaryAddress: "16 Boulevard des Italiens, 75009 Paris, France",
    transferType: "standard"
  };

  const transactionRef = useMemoFirebase(
    () => (id && userId ? doc(db, "users", userId, "bankAccounts", bankAccountId, "transactions", id as string) : null),
    [db, id, userId, bankAccountId]
  );

  const { data: dbTransaction, isLoading } = useDoc(transactionRef);
  const transaction = dbTransaction || (id === "trx-bnp-3180000" ? mockBnpTransaction : null);

  const handleDelete = () => {
    if (!transactionRef) return;
    setIsDeleting(true);
    deleteDocumentNonBlocking(transactionRef);
    toast({
      title: "Virement supprimé",
      description: "L'opération a été retirée de votre historique.",
    });
    router.replace("/dashboard");
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast({
        title: "Reçu généré",
        description: "Le document PDF a été enregistré.",
      });
    }, 2000);
  };

  const showUnderConstruction = () => {
    toast({
      title: "En cours de construction",
      description: "Cette fonctionnalité sera disponible prochainement dans votre espace ING Private Banking.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Clock className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Ordre non trouvé</h2>
        <Button onClick={() => router.back()} className="mt-6 rounded-xl font-bold px-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      </div>
    );
  }

  const isFailed = transaction.status === "Failed";

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <Button variant="ghost" onClick={() => router.back()} className="font-bold hover:text-primary transition-all p-0">
          <ArrowLeft className="mr-2 h-5 w-5" /> Retour à l'historique
        </Button>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="rounded-xl border-2 font-bold h-12 px-6 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? "En cours..." : "Supprimer"}
          </Button>
          <Button 
            variant="default" 
            onClick={handleDownload}
            disabled={isDownloading}
            className="rounded-xl font-black h-12 px-8 shadow-xl shadow-primary/10 transition-all hover:scale-[1.02]"
          >
            <FileDown className="mr-2 h-5 w-5" /> {isDownloading ? "Génération..." : "Télécharger le reçu PDF"}
          </Button>
        </div>
      </header>

      {isFailed && (
        <Card className="border-none shadow-2xl bg-red-50 ring-2 ring-red-100 overflow-hidden relative animate-in slide-in-from-top-6 duration-700">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <ShieldAlert className="h-40 w-40 text-red-600" />
          </div>
          <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="bg-red-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-red-200 animate-pulse">
              <Lock className="h-14 w-14" />
            </div>
            <div className="space-y-3 text-center md:text-left">
              <Badge variant="destructive" className="font-black uppercase tracking-widest text-[10px] px-4 py-1.5 mb-2">Avis de suspension immédiate</Badge>
              <h2 className="text-4xl font-black text-red-600 tracking-tighter leading-none">Virement Suspendu par SafeGuard</h2>
              <p className="text-xl font-bold text-red-700/80 leading-snug max-w-2xl">
                Cet ordre a été intercepté par notre audit de conformité Private Banking. 
                Une validation d'identité est requise pour libérer les fonds.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="premium-card border-none overflow-hidden relative shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)]">
            <div className="absolute top-0 left-0 w-full h-4 bg-primary" />
            
            <CardHeader className="bg-gray-50/50 pb-10 border-b border-gray-100 px-12 pt-12">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 inline-block">
                    <Image src="https://i.imgur.com/WWZ10oQ.png" alt="ING Logo" width={90} height={36} className="opacity-90" />
                  </div>
                  <h3 className="text-4xl font-black text-[#333] tracking-tighter">Avis de Virement</h3>
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Document Certifié • Private Banking Gold</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">RÉFÉRENCE ARCHIVE</p>
                  <p className="text-sm font-mono font-bold text-[#333] bg-white px-4 py-1.5 rounded-xl border border-gray-100 shadow-sm inline-block">#TRX-{transaction.id.slice(-10).toUpperCase()}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="p-12 text-center bg-white relative">
                <div className="absolute inset-0 bg-primary/5 blur-[80px] opacity-30 pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <p className="text-[13px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-4">Montant Principal</p>
                  <p className="text-8xl font-black text-[#333] tracking-tighter drop-shadow-md">€ {transaction.amount.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <Badge variant="outline" className="font-bold border-primary/20 text-primary px-5 py-1.5 rounded-full uppercase text-[11px] tracking-widest bg-primary/5">
                      {transaction.transferType === 'instant' ? 'Virement Instantané' : 'Virement Classique'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-100" />

              <div className="p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="text-[11px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" /> Donneur d'Ordre
                    </div>
                    <div className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-inner space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm"><User className="h-6 w-6 text-primary" /></div>
                        <div>
                          <p className="font-black text-[#333] text-xl">Bernard Berlin Leroy</p>
                          <p className="text-xs font-bold text-muted-foreground">Compte Private Gold</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200/50">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">IBAN / Compte</p>
                        <p className="font-mono font-bold text-sm tracking-widest">BE31 3401 8410 7755</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300" /> Destinataire
                    </div>
                    <div className="p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 group hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-2xl"><Building2 className="h-6 w-6 text-gray-500" /></div>
                        <div>
                          <p className="font-black text-[#333] text-xl">{transaction.beneficiaryName}</p>
                          <p className="text-xs font-bold text-muted-foreground">{transaction.beneficiaryBankName || 'Institution Destinataire'}</p>
                        </div>
                      </div>
                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">IBAN / Compte</p>
                          <p className="font-mono font-bold text-sm tracking-widest">{transaction.beneficiaryIban}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">BIC / SWIFT</p>
                            <p className="font-mono font-bold text-xs">{transaction.beneficiaryBic || 'N/A'}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Localisation</p>
                             <div className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <p className="text-[10px] font-bold text-gray-500 truncate">{transaction.beneficiaryAddress || 'Adresse certifiée'}</p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-100/50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Planification Temporelle</p>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <Clock className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="font-bold text-[#333]">{new Date(transaction.transactionDate).toLocaleDateString('fr-BE', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        <p className="text-xs text-muted-foreground font-medium">Valeur créditée le {new Date(transaction.transactionDate).toLocaleDateString('fr-BE')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Communication Officielle</p>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <FileText className="h-6 w-6 text-gray-400" />
                      <p className="font-bold text-[#333] italic leading-snug">"{transaction.description || 'Libellé de virement Private'}"</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 text-white p-12 rounded-b-[2.5rem] relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                  <div className="space-y-4 text-center md:text-left">
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Ventilation des Coûts</p>
                    <div className="flex gap-10">
                      <div>
                        <p className="text-white/50 text-xs font-bold mb-1">Principal</p>
                        <p className="text-2xl font-black">€ {transaction.amount.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-bold mb-1">Frais {transaction.transferType === 'instant' ? 'Instant' : 'Standard'}</p>
                        <p className="text-2xl font-black">€ {(transaction.fee || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center md:text-right space-y-1">
                    <p className="text-[14px] font-black text-primary uppercase tracking-[0.4em]">Débit Total Effectif</p>
                    <p className="text-6xl font-black tracking-tighter text-white">€ {(transaction.totalAmount || transaction.amount).toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 sticky top-24">
          <Card className="premium-card border-none overflow-hidden ring-1 ring-black/5">
            <CardHeader className="bg-gray-50/50 pb-8 border-b border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg"><ShieldCheck className="h-6 w-6 text-green-600" /></div>
                <CardTitle className="text-2xl font-bold font-headline">Audit SafeGuard</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                  <div className="space-y-1">
                    <p className="text-sm font-black text-[#333]">Certificat d'origine</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Identité de l'émetteur vérifiée par certificat numérique ING ID Gold.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                  <div className="space-y-1">
                    <p className="text-sm font-black text-[#333]">Chiffrement Bancaire</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Flux de données IBAN/BIC sécurisé via tunnel SEPA-NET 2.0.</p>
                  </div>
                </div>
                {isFailed && (
                  <div className="flex gap-4 items-start p-5 bg-red-50 rounded-[2rem] border border-red-100 animate-in shake-in duration-500">
                    <div className="mt-1.5 w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
                    <div className="space-y-1">
                      <p className="text-sm font-black text-red-600">Interruption AML-402</p>
                      <p className="text-[11px] text-red-700/80 font-bold leading-tight italic">
                        Transaction suspendue pour anomalie de profilage Private Banking. Audit manuel requis.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex flex-col gap-3">
                 <Button 
                   onClick={showUnderConstruction}
                   className="w-full bg-[#333] hover:bg-black text-white font-black h-14 rounded-2xl text-sm uppercase tracking-widest shadow-xl transition-all"
                 >
                    Imprimer le reçu
                 </Button>
                 <Button 
                   variant="ghost" 
                   onClick={showUnderConstruction}
                   className="font-bold text-gray-500 hover:text-primary"
                 >
                    <Share2 className="mr-2 h-4 w-4" /> Partage sécurisé
                 </Button>
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={showUnderConstruction}
            className="p-10 rounded-[3rem] bg-gradient-to-br from-[#3b0051] to-[#2a003a] text-white space-y-6 shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all" />
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-xl ring-1 ring-white/30">
                <Landmark className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black">Besoin d'assistance?</h3>
            </div>
            <p className="text-sm font-medium text-white/80 leading-relaxed">
              Votre conseiller Private Banking Sophie de Meyer est disponible pour valider cet ordre.
            </p>
            <Button variant="link" className="p-0 text-primary font-black text-base flex items-center gap-2 group-hover:underline">
              Contacter mon conseiller <ChevronRight className="h-5 w-5" />
            </Button>
          </Card>
          
          <div className="flex flex-col items-center justify-center pt-4 opacity-30 grayscale">
            <Image src="https://i.imgur.com/WWZ10oQ.png" alt="ING Logo" width={60} height={24} className="mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">ING BELGIUM © 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}

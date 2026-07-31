"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Landmark, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Search,
  ShieldAlert,
  Lock,
  Scale,
  AlertTriangle,
  FileWarning
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

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

export default function DashboardPage() {
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Bonjour");
  const [isSuspensionModalOpen, setIsSuspensionModalOpen] = useState(true);
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const userId = user?.uid;
  const bankAccountId = "be31-3401-8410-7755";
  
  const userProfileRef = useMemoFirebase(() => userId ? doc(db, "users", userId) : null, [db, userId]);
  const { data: userProfile } = useDoc(userProfileRef);

  const bankAccountRef = useMemoFirebase(() => userId ? doc(db, "users", userId, "bankAccounts", bankAccountId) : null, [db, userId, bankAccountId]);
  const { data: bankAccount } = useDoc(bankAccountRef);

  const transactionsQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return query(
      collection(db, "users", userId, "bankAccounts", bankAccountId, "transactions"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
  }, [db, userId, bankAccountId]);

  const { data: dbTransactions, isLoading: isTransactionsLoading } = useCollection(transactionsQuery);

  useEffect(() => {
    const now = new Date();
    setLastLogin(now.toLocaleString('fr-BE'));
    
    const currentHour = now.getHours();
    if (currentHour < 12) {
      setGreeting("Bonjour");
    } else if (currentHour < 18) {
      setGreeting("Bon après-midi");
    } else {
      setGreeting("Bonsoir");
    }

    if (userId) {
      const accRef = doc(db, "users", userId, "bankAccounts", bankAccountId);
      setDocumentNonBlocking(accRef, {
        id: bankAccountId,
        iban: "BE31 3401 8410 7755",
        bic: "BBRUBEBB",
        balance: 3180000.00,
        status: "Suspendu",
        currency: "EUR",
        userId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      const trxRef = doc(db, "users", userId, "bankAccounts", bankAccountId, "transactions", "trx-bnp-3180000");
      setDocumentNonBlocking(trxRef, mockBnpTransaction, { merge: true });
    }
  }, [db, userId, bankAccountId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return <Badge variant="secondary" className="bg-green-100 text-green-800 border-none shadow-sm">Terminé</Badge>;
        case 'Pending':
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none shadow-sm">En attente</Badge>;
        case 'Failed':
            return <Badge variant="destructive" className="bg-red-100 text-red-800 border-none shadow-sm font-bold">Bloqué</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
  };

  const showUnderConstruction = () => {
    toast({
      title: "Compte Suspendu",
      description: "Votre compte est temporairement bloqué par décision de l'Administration Fiscale.",
      variant: "destructive"
    });
  };

  const currentBalance = bankAccount?.balance ?? 3180000.00;
  const displayName = userProfile?.firstName || "Bernard";
  const transactionsList = (dbTransactions && dbTransactions.length > 0) ? dbTransactions : [mockBnpTransaction];

  return (
    <TooltipProvider>
      {/* POP-UP MODAL DE SUSPENSION FISCALE & SAISIE JUDICIAIRE */}
      <AlertDialog open={isSuspensionModalOpen} onOpenChange={setIsSuspensionModalOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl border-2 border-red-500 shadow-2xl p-0">
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-5 sm:p-8 relative">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shrink-0">
                <ShieldAlert className="h-7 w-7 sm:h-10 sm:w-10 text-white animate-pulse" />
              </div>
              <div>
                <Badge variant="outline" className="bg-white/20 text-white border-white/40 font-black uppercase text-[9px] sm:text-[10px] tracking-widest mb-1">
                  Avis d'Exécution Fiscale & Judiciaire
                </Badge>
                <AlertDialogTitle className="text-lg sm:text-2xl font-black tracking-tight text-white leading-tight">
                  NOTIFICATION DE SUSPENSION DE COMPTE
                </AlertDialogTitle>
                <p className="text-[11px] sm:text-xs text-white/80 font-mono mt-1">Réf. Ordonnance : SATD-2026-99412-IMP</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            <div className="p-4 sm:p-5 bg-red-50 rounded-2xl border border-red-200 flex items-start gap-3 sm:gap-4">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="font-black text-red-800 text-sm sm:text-base">Mesure Conservatoire et Saisie-Attribution</p>
                <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
                  Votre compte bancaire a été <strong>suspendu par l'Administration des Impôts (Direction Générale des Finances Publiques)</strong> pour motif d'<strong>impôts impayés</strong>.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <Scale className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-gray-900 text-xs sm:text-sm">Procédure judiciaire en cours</p>
                  <p className="text-xs text-gray-600 leading-snug">
                    Une procédure judiciaire d'exécution forcée est actuellement ouverte auprès du tribunal compétent et des services fiscaux.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <Lock className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-gray-900 text-xs sm:text-sm">Interdiction d'accès aux fonds</p>
                  <p className="text-xs text-gray-600 leading-snug">
                    Vous ne pouvez <strong>ni retirer, ni effectuer de virement, ni toucher aux fonds disponibles</strong> sur votre compte pendant toute la durée de la mesure conservatoire.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-gray-900 text-xs sm:text-sm">Conditions de déblocage</p>
                  <p className="text-xs text-gray-600 leading-snug">
                    Le compte sera <strong>débloqué et réactivé uniquement après la clôture définitive de la procédure judiciaire</strong> et la régularisation intégrale des sommes dues aux services des impôts.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <AlertDialogAction 
                onClick={() => setIsSuspensionModalOpen(false)}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-red-200"
              >
                Compris (Prendre acte de la mesure)
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-8 max-w-6xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-primary tracking-widest uppercase">Espace Client Premium</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#333] font-headline">
              {greeting}, <span className="text-[#ff6200] relative">{displayName}!
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/20 rounded-full"></span>
              </span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg">
              Voici un aperçu de vos finances, M. {userProfile?.firstName || 'Bernard'} {userProfile?.lastName || 'Berlin Leroy'}.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/50 text-xs sm:text-sm text-muted-foreground shadow-sm ring-1 ring-black/5 w-fit">
              <Clock className="h-4 w-4 text-[#ff6200] shrink-0" />
              <span>Dernière connexion: <span className="font-semibold text-[#333]">{lastLogin || 'Chargement...'}</span></span>
          </div>
        </header>

        {/* BANNIÈRE PERMANENTE D'ALERTE SAISIE FISCALE */}
        <Card className="border-2 border-red-500 bg-gradient-to-r from-red-50 via-white to-red-50 shadow-xl overflow-hidden relative animate-in fade-in slide-in-from-top-2 duration-500">
          <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              <div className="bg-red-600 text-white p-3.5 sm:p-4 rounded-2xl shadow-lg shadow-red-200 shrink-0">
                <ShieldAlert className="h-7 w-7 sm:h-8 sm:w-8 animate-pulse" />
              </div>
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <Badge variant="destructive" className="font-black uppercase text-[9px] sm:text-[10px] tracking-widest bg-red-600 text-white px-2.5 py-0.5 sm:px-3 sm:py-1">
                    COMPTE SUSPENDU • SAISIE FISCALE
                  </Badge>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-md">SATD-2026-99412-IMP</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-red-900">Compte bloqué par l'Administration des Impôts (Impôts Impayés)</h3>
                <p className="text-xs font-semibold text-red-800/90 leading-relaxed max-w-3xl">
                  Une procédure judiciaire est actuellement en cours. Vous ne pouvez ni retirer ni toucher aux fonds. Le compte sera débloqué une fois la procédure finalisée.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsSuspensionModalOpen(true)}
              className="w-full sm:w-auto shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-black px-5 py-3 rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              Détails de l'avis
            </button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8">
            <Card className="overflow-hidden border-none shadow-[0_15px_50px_rgba(0,0,0,0.06)] bg-white/90 backdrop-blur-md relative ring-1 ring-black/5 animate-in zoom-in-95 duration-700">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />
                
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 relative z-10 border-b border-gray-100/50">
                    <div className="space-y-1">
                        <CardTitle className="text-lg sm:text-xl text-gray-500 font-medium">Solde du compte</CardTitle>
                        <CardDescription className="text-gray-800 font-mono text-base sm:text-lg font-bold">{bankAccount?.iban || 'BE31 3401 8410 7755'}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-red-600 text-white font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse w-fit">
                        <Lock className="h-4 w-4 shrink-0" />
                        <span>COMPTE SUSPENDU</span>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-8 pt-6 sm:pt-8 relative z-10 px-3 sm:px-6">
                    <div className="bg-gradient-to-br from-[#ff6200] via-[#ff7c26] to-[#e05600] p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(255,98,0,0.4)] text-white group transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_25px_60px_-10px_rgba(255,98,0,0.5)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
                          <div className="w-full sm:w-auto">
                            <p className="text-white/80 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2">Solde disponible</p>
                            <p className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter drop-shadow-md break-all">€ {currentBalance.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
                          </div>
                          <div className="bg-white/20 p-3 sm:p-4 rounded-2xl backdrop-blur-xl border border-white/30 shadow-inner group-hover:scale-110 transition-transform duration-500 self-end sm:self-start">
                            <TrendingUp className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
                          </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card className="border-none shadow-[0_15px_50px_rgba(0,0,0,0.04)] bg-white/90 backdrop-blur-md ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100/50 pb-6">
              <div>
                <CardTitle className="text-xl sm:text-2xl text-[#333] font-headline font-bold">Transactions Récentes</CardTitle>
                <CardDescription className="text-sm sm:text-base">Historique de vos dernières opérations bancaires.</CardDescription>
              </div>
              <Badge 
                variant="outline" 
                onClick={showUnderConstruction}
                className="text-[#ff6200] border-[#ff6200]/30 font-bold px-4 py-1.5 sm:px-6 rounded-full hover:bg-primary/5 transition-colors cursor-pointer text-xs sm:text-sm w-fit"
              >
                Voir tout l'historique
              </Badge>
            </CardHeader>
            <CardContent className="pt-6 px-2 sm:px-6">
            <div className="rounded-[1.5rem] border border-gray-100/50 overflow-x-auto w-full shadow-inner bg-white/50">
              <Table className="min-w-[650px] sm:min-w-full">
                  <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="w-20"></TableHead>
                      <TableHead className="font-bold text-[#333] text-sm uppercase tracking-wider">Description</TableHead>
                      <TableHead className="font-bold text-[#333] text-sm uppercase tracking-wider">Date</TableHead>
                      <TableHead className="font-bold text-[#333] text-sm uppercase tracking-wider">Type</TableHead>
                      <TableHead className="font-bold text-[#333] text-sm uppercase tracking-wider">Statut</TableHead>
                      <TableHead className="text-right font-bold text-[#333] text-sm uppercase tracking-wider">Montant</TableHead>
                      <TableHead className="w-12"></TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {isTransactionsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <Clock className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                        <span className="font-bold text-muted-foreground">Chargement des transactions...</span>
                      </TableCell>
                    </TableRow>
                  ) : transactionsList && transactionsList.length > 0 ? (
                    transactionsList.map((t) => (
                      <TableRow 
                        key={t.id} 
                        className="group hover:bg-white/80 transition-all duration-300 border-b border-gray-50/50 last:border-none cursor-pointer"
                        onClick={() => router.push(`/transactions/${t.id}`)}
                      >
                      <TableCell>
                          <div className="h-14 w-14 rounded-2xl bg-gray-100/50 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-white">
                              {t.transactionType === 'Transfer' ? <ArrowDownLeft className="h-7 w-7 text-red-600" /> : <Landmark className="h-7 w-7 text-green-600" />}
                          </div>
                      </TableCell>
                      <TableCell className="font-bold text-gray-800 text-base">
                        {t.transactionType === 'Deposit' ? (t.beneficiaryName ? `De ${t.beneficiaryName}` : t.description) : (t.beneficiaryName ? `Vers ${t.beneficiaryName}` : t.description)}
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">#TRX-{t.id.slice(-8).toUpperCase()}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-semibold">
                        {t.transactionDate ? new Date(t.transactionDate).toLocaleDateString('fr-BE') : 'N/A'}
                      </TableCell>
                      <TableCell>
                          <Badge variant={t.transactionType === 'Deposit' ? 'secondary' : 'destructive'} className={`capitalize border-none flex items-center w-fit gap-1.5 py-1 px-3 rounded-lg shadow-sm font-bold ${t.transactionType === 'Deposit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {t.transactionType === 'Deposit' ? <ArrowUpRight className="h-3.5 w-3.5"/> : <ArrowDownLeft className="h-3.5 w-3.5"/>}
                          {t.transactionType === 'Deposit' ? 'Crédit' : 'Débit'}
                          </Badge>
                      </TableCell>
                      <TableCell>
                          {getStatusBadge(t.status)}
                      </TableCell>
                      <TableCell className={`text-right text-xl font-black ${t.transactionType === 'Deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                          {t.transactionType === 'Deposit' ? '+' : '-'}€{t.amount.toLocaleString('fr-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                      </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground font-bold">
                        Aucune transaction trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                  </TableBody>
              </Table>
            </div>
            </CardContent>
        </Card>

      </div>
    </TooltipProvider>
  );
}

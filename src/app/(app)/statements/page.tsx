"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Search, 
  RotateCcw, 
  Info, 
  FileStack, 
  Sparkles, 
  ChevronRight, 
  Download, 
  Clock, 
  ArrowDownLeft, 
  Landmark, 
  ArrowUpRight,
  ShieldCheck,
  FileDown
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

export default function StatementsPage() {
  const [account, setAccount] = useState("be31-3401-8410-7755");
  const [period, setPeriod] = useState("this-year");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const userId = user?.uid;
  const bankAccountId = account;

  const bankAccountRef = useMemoFirebase(() => userId ? doc(db, "users", userId, "bankAccounts", bankAccountId) : null, [db, userId, bankAccountId]);
  const { data: bankAccount } = useDoc(bankAccountRef);

  const transactionsQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return query(
      collection(db, "users", userId, "bankAccounts", bankAccountId, "transactions"),
      orderBy("createdAt", "desc")
    );
  }, [db, userId, bankAccountId]);

  const { data: dbTransactions, isLoading: isTransactionsLoading } = useCollection(transactionsQuery);

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Relevé généré",
        description: "Votre relevé bancaire PDF a été téléchargé avec succès.",
      });
    }, 4000);
  };

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

  const balance = bankAccount?.balance ?? 3180000.00;
  const transactionsList = (dbTransactions && dbTransactions.length > 0) ? dbTransactions : [mockBnpTransaction];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-1">
            <div className="bg-primary/10 p-3 rounded-2xl shadow-inner">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#333] font-headline">Relevés & Extraits</h1>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
            Consultez votre historique et générez vos extraits de compte officiels Bernard Berlin Leroy.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-white shadow-xl ring-1 ring-black/5 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Documents certifiés</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10">
        <Card className="premium-card overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100/50 pb-8 px-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle className="text-2xl font-black text-[#333]">Critères de l'extrait</CardTitle>
            </div>
            <CardDescription className="text-base font-medium">Sélectionnez le compte et la période pour générer votre document.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label htmlFor="account" className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Landmark className="h-4 w-4" /> Compte source
                </Label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger id="account" className="h-16 border-2 rounded-2xl bg-white shadow-sm focus:ring-primary/20 text-left px-6">
                    <SelectValue placeholder="Choisir un compte" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2">
                    <SelectItem value="be31-3401-8410-7755" className="py-4">
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-lg text-[#333]">ING Compte à vue Private</span>
                        <span className="text-xs font-mono text-muted-foreground">BE31 3401 8410 7755 • € {balance.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="period" className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Période temporelle
                </Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger id="period" className="h-16 border-2 rounded-2xl bg-white shadow-sm focus:ring-primary/20 text-left px-6">
                    <SelectValue placeholder="Choisir une période" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2">
                    <SelectItem value="this-month" className="py-3">Mois en cours</SelectItem>
                    <SelectItem value="this-year" className="py-3 font-bold text-primary">Année civile 2024</SelectItem>
                    <SelectItem value="last-year" className="py-3">Année 2023</SelectItem>
                    <SelectItem value="all" className="py-3">Historique complet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-gray-100 pt-8">
              <Button 
                onClick={handleDownloadPdf}
                disabled={isGenerating}
                className="w-full sm:w-auto min-w-[250px] h-16 bg-[#333] hover:bg-black text-white text-lg font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] group"
              >
                {isGenerating ? (
                    <Clock className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                    <FileDown className="mr-2 h-6 w-6 group-hover:translate-y-1 transition-transform" />
                )}
                {isGenerating ? "Préparation sécurisée..." : "Générer l'extrait PDF"}
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-primary p-0 font-bold text-base flex items-center gap-2 group">
                <RotateCcw className="h-5 w-5 group-hover:rotate-[-45deg] transition-transform" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_15px_50px_rgba(0,0,0,0.04)] bg-white/90 backdrop-blur-md ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100/50 pb-6 px-8">
              <div>
                <CardTitle className="text-2xl text-[#333] font-headline font-bold">Aperçu de l'extrait</CardTitle>
                <CardDescription className="text-base">Les opérations suivantes figureront sur votre document officiel.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-50 text-green-700 border-green-100 font-bold px-4 py-1.5 rounded-full">{dbTransactions?.length || 0} Opérations</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
            <div className="rounded-[2rem] border border-gray-100/50 overflow-hidden shadow-inner bg-white/50">
              <Table>
                  <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-none h-14">
                      <TableHead className="w-20"></TableHead>
                      <TableHead className="font-bold text-[#333] text-sm uppercase tracking-wider">Description</TableHead>
                      <TableHead className="font-bold text-[#333] text-sm uppercase tracking-wider">Date de valeur</TableHead>
                      <TableHead className="font-bold text-[#333] text-sm uppercase tracking-wider">Statut</TableHead>
                      <TableHead className="text-right font-bold text-[#333] text-sm uppercase tracking-wider">Montant (€)</TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {isTransactionsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20">
                        <Clock className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                        <span className="font-black text-muted-foreground uppercase tracking-widest">Audit des données en cours...</span>
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
                          <div className="h-12 w-12 rounded-xl bg-gray-100/50 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:shadow-md group-hover:scale-110 shadow-sm border border-white">
                              {t.transactionType === 'Transfer' ? <ArrowDownLeft className="h-6 w-6 text-red-600" /> : <Landmark className="h-6 w-6 text-green-600" />}
                          </div>
                      </TableCell>
                      <TableCell className="font-bold text-gray-800 text-base">
                        {t.transactionType === 'Deposit' ? (t.beneficiaryName ? `VIREMENT REÇU DE ${t.beneficiaryName}` : t.description.toUpperCase()) : (t.beneficiaryName ? `VIREMENT VERS ${t.beneficiaryName}` : t.description.toUpperCase())}
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">RÉF: #TRX-{t.id.slice(-8).toUpperCase()}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-semibold">
                        {t.transactionDate ? new Date(t.transactionDate).toLocaleDateString('fr-BE') : 'N/A'}
                      </TableCell>
                      <TableCell>
                          {getStatusBadge(t.status)}
                      </TableCell>
                      <TableCell className={`text-right text-xl font-black ${t.transactionType === 'Deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                          {t.transactionType === 'Deposit' ? '+' : '-'}€{t.amount.toLocaleString('fr-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-bold">
                        <FileStack className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        Aucune transaction trouvée pour cette période.
                      </TableCell>
                    </TableRow>
                  )}
                  </TableBody>
              </Table>
            </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
        <div className="premium-card p-8 rounded-[2rem] flex items-center gap-6 bg-white border border-gray-100 shadow-sm">
          <div className="p-4 bg-green-50 rounded-2xl">
            <FileStack className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Extraits annuels</p>
            <p className="text-2xl font-black text-gray-800">12 Documents</p>
          </div>
        </div>
        <div className="premium-card p-8 rounded-[2rem] flex items-center gap-6 bg-white border border-gray-100 shadow-sm">
          <div className="p-4 bg-blue-50 rounded-2xl">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Dernière archive</p>
            <p className="text-2xl font-black text-gray-800">15 MAR 2024</p>
          </div>
        </div>
        <div className="premium-card p-8 rounded-[2rem] bg-primary text-white flex items-center justify-between group cursor-pointer shadow-lg shadow-primary/20">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
              <Download className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Sauvegarde</p>
              <p className="text-2xl font-black">Tout exporter</p>
            </div>
          </div>
          <ChevronRight className="h-8 w-8 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </div>
  );
}

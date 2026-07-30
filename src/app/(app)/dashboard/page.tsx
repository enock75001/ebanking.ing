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
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Landmark, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Search
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
      title: "En cours de construction",
      description: "Cette fonctionnalité sera disponible prochainement dans votre espace ING Private Banking.",
    });
  };

  const currentBalance = bankAccount?.balance ?? 3180000.00;
  const displayName = userProfile?.firstName || "Bernard";
  const transactionsList = (dbTransactions && dbTransactions.length > 0) ? dbTransactions : [mockBnpTransaction];

  return (
    <TooltipProvider>
      <div className="space-y-8 max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary tracking-widest uppercase">Espace Client Premium</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#333] font-headline">
              {greeting}, <span className="text-[#ff6200] relative">{displayName}!
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/20 rounded-full"></span>
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Voici un aperçu de vos finances, M. {userProfile?.firstName || 'Bernard'} {userProfile?.lastName || 'Berlin Leroy'}.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/50 text-sm text-muted-foreground shadow-sm ring-1 ring-black/5">
              <Clock className="h-4 w-4 text-[#ff6200]" />
              <span>Dernière connexion: <span className="font-semibold text-[#333]">{lastLogin || 'Chargement...'}</span></span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
            <Card className="overflow-hidden border-none shadow-[0_15px_50px_rgba(0,0,0,0.06)] bg-white/90 backdrop-blur-md relative ring-1 ring-black/5 animate-in zoom-in-95 duration-700">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />
                
                <CardHeader className="flex flex-row items-center justify-between pb-4 relative z-10 border-b border-gray-100/50">
                    <div className="space-y-1">
                        <CardTitle className="text-xl text-gray-500 font-medium">Solde du compte</CardTitle>
                        <CardDescription className="text-gray-800 font-mono text-lg font-bold">{bankAccount?.iban || 'BE31 3401 8410 7755'}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        <ShieldCheck className="h-4 w-4" />
                        <span>COMPTE ACTIF</span>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-8 pt-8 relative z-10">
                    <div className="bg-gradient-to-br from-[#ff6200] via-[#ff7c26] to-[#e05600] p-10 rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(255,98,0,0.4)] text-white group transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_25px_60px_-10px_rgba(255,98,0,0.5)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                        <div className="flex justify-between items-start relative z-10">
                          <div>
                            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-2">Solde disponible</p>
                            <p className="text-7xl font-black tracking-tighter drop-shadow-md">€ {currentBalance.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
                          </div>
                          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-xl border border-white/30 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp className="h-10 w-10 text-white" />
                          </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card className="border-none shadow-[0_15px_50px_rgba(0,0,0,0.04)] bg-white/90 backdrop-blur-md ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100/50 pb-6">
              <div>
                <CardTitle className="text-2xl text-[#333] font-headline font-bold">Transactions Récentes</CardTitle>
                <CardDescription className="text-base">Historique de vos dernières opérations bancaires.</CardDescription>
              </div>
              <Badge 
                variant="outline" 
                onClick={showUnderConstruction}
                className="text-[#ff6200] border-[#ff6200]/30 font-bold px-6 py-1.5 rounded-full hover:bg-primary/5 transition-colors cursor-pointer text-sm"
              >
                Voir tout l'historique
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
            <div className="rounded-[1.5rem] border border-gray-100/50 overflow-hidden shadow-inner bg-white/50">
              <Table>
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

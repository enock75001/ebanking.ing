"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  ChevronRight, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

export default function AccountsPage() {
  const db = useFirestore();
  const { user } = useUser();
  const userId = user?.uid;

  const accountsQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return collection(db, "users", userId, "bankAccounts");
  }, [db, userId]);

  const { data: dbAccounts, isLoading } = useCollection(accountsQuery);

  // Fallback data with 3180000€ balance
  const staticAccounts = [
    {
      id: "1",
      name: "ING Compte à vue Private",
      number: "BE31 3401 8410 7755",
      balance: 3180000.00,
      type: "Courant",
      status: "Suspendu (Saisie Fiscale)",
      icon: Wallet,
      color: "text-red-600",
      bg: "bg-red-50",
      glow: "shadow-[0_0_30px_rgba(220,38,38,0.15)]"
    },
    {
      id: "2",
      name: "ING Lion Deposit (Épargne)",
      number: "BE98 7654 3210 9876",
      balance: 0.00,
      type: "Épargne",
      status: "Suspendu",
      icon: PiggyBank,
      color: "text-red-600",
      bg: "bg-red-50",
      glow: "shadow-[0_0_30px_rgba(220,38,38,0.1)]"
    }
  ];

  const accounts = dbAccounts && dbAccounts.length > 0 ? dbAccounts.map(acc => ({
    ...staticAccounts.find(s => s.id === "1")!, // base styles
    id: acc.id,
    name: acc.name || "ING Compte à vue Private",
    number: acc.iban || acc.accountNumber || "BE31 3401 8410 7755",
    balance: acc.balance ?? 3180000.00,
    status: acc.status || "Suspendu (Saisie Fiscale)"
  })) : staticAccounts;

  const totalWealth = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="space-y-8 sm:space-y-10 max-w-6xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl shadow-inner shrink-0">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-headline text-[#333]">Mes comptes</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Gérez l'ensemble de vos actifs financiers Bernard.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-white shadow-xl ring-1 ring-black/5 flex flex-col items-start md:items-end w-fit">
          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Patrimoine Total</p>
          <p className="text-2xl sm:text-3xl font-black text-primary">€ {totalWealth.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {accounts.map((account) => (
          <Card key={account.id} className={`premium-card group overflow-hidden border-none relative ${account.glow || ""}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none group-hover:bg-red-500/10 transition-all duration-700" />
            
            <div className="flex flex-col lg:flex-row">
              <div className={`${account.bg || "bg-red-50"} p-6 sm:p-8 lg:w-72 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100/50 transition-colors duration-500 group-hover:bg-white`}>
                <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-[2rem] shadow-lg ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-500">
                  {account.icon ? <account.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${account.color}`} /> : <Wallet className="h-10 w-10 sm:h-12 sm:w-12 text-red-600" />}
                </div>
                <Badge variant="destructive" className={`mt-4 sm:mt-6 font-black uppercase tracking-widest px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-red-600 text-white border-none shadow-md text-xs`}>
                  {account.status || "Suspendu"}
                </Badge>
              </div>

              <div className="flex-1 p-5 sm:p-8 lg:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl sm:text-2xl font-black text-[#333] group-hover:text-primary transition-colors">{account.name}</CardTitle>
                    <CardDescription className="font-mono text-sm sm:text-base font-medium">{account.number}</CardDescription>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl sm:text-4xl font-black tracking-tighter text-[#333] break-all">
                      € {account.balance.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Solde disponible</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                            <TrendingUp className="h-4 w-4" />
                            Utilisation du plafond
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#333]">0%</span>
                    </div>
                    <Progress value={0} className="h-2 sm:h-2.5 rounded-full bg-gray-100 shadow-inner" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-gray-50">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 border border-gray-100">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        Garanti par l'État
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 border border-gray-100">
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                        Taux: 0.85%
                    </div>
                  </div>
                  <Link href="/rib">
                    <Button variant="ghost" className="w-full sm:w-auto font-bold text-primary group-hover:translate-x-1 transition-transform text-sm">
                      Gérer ce compte <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

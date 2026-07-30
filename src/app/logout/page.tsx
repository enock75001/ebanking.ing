"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  RotateCcw
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    // Clear authentication state from localStorage
    localStorage.removeItem("isAuthenticated");

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#141414] relative overflow-hidden text-white font-sans">
      {/* Ambient background glowing circles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-green-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="z-10 w-full max-w-lg p-8 sm:p-12 rounded-[2.5rem] bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-700">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-[#ff6200] to-green-500" />

        {/* ING Logo Badge */}
        <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-inner">
          <Image
            src="https://i.imgur.com/WWZ10oQ.png"
            alt="ING Logo"
            width={110}
            height={44}
            className="brightness-0 invert object-contain"
            priority
          />
        </div>

        {/* Central Verified Icon Badge */}
        <div className="relative my-4">
          <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-pulse">
            <ShieldCheck className="h-16 w-16 text-green-400" />
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-2 my-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-headline">
            Session Clôturée
          </h1>
          <p className="text-sm text-gray-300 font-medium max-w-sm mx-auto">
            Vous avez été déconnecté en toute sécurité de votre Espace Client ING Private Banking.
          </p>
        </div>

        {/* Security Summary Checklist */}
        <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 my-4 space-y-3 text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6200] mb-2">
            Rapport de Sécurité Session
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-200 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
            <span>Jeton d'accès et session ING ID révoqués</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-200 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
            <span>Données confidentielles et cache purgés</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-200 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
            <span>Canal chiffré SSL/TLS fermé</span>
          </div>
        </div>

        {/* Redirection Countdown and Action Button */}
        <div className="w-full space-y-4 pt-4">
          <p className="text-xs text-gray-400 font-medium">
            Redirection automatique vers l'accueil dans <span className="font-black font-mono text-white text-base px-2 py-0.5 bg-white/10 rounded">{countdown}s</span>
          </p>
          
          <Button 
            onClick={() => router.replace("/")}
            className="w-full bg-[#ff6200] hover:bg-[#e05600] text-white font-black h-13 rounded-2xl text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Se reconnecter <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-8">
          ING BELGIUM SA/NV © 2026 • PRIVATE BANKING SECURITY
        </p>
      </div>
    </main>
  );
}

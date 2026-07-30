"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  LoaderCircle, 
  CheckCircle2, 
  Cpu
} from "lucide-react";
import Image from "next/image";

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(10);
  const [statusMessage, setStatusMessage] = useState("Initialisation du canal chiffré ING SafeGuard™...");

  useEffect(() => {
    // Smooth progress bar update
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) {
      setStatusMessage("Initialisation du canal chiffré ING SafeGuard™...");
    } else if (progress < 55) {
      setStatusMessage("Vérification des certificats bancaires Private Gold...");
    } else if (progress < 85) {
      setStatusMessage("Synchronisation du solde & audit des transactions...");
    } else if (progress < 100) {
      setStatusMessage("Chargement de votre Espace Client Premium...");
    } else {
      setStatusMessage("Accès autorisé. Bienvenue M. Leroy.");
    }
  }, [progress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 4200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#141414] relative overflow-hidden text-white font-sans">
      {/* Dynamic ambient glowing background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff6200]/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Container */}
      <div className="z-10 w-full max-w-lg p-8 sm:p-12 rounded-[2.5rem] bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-700">
        
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff6200] to-transparent" />

        {/* ING Logo Badge */}
        <div className="mb-8 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-inner relative group">
          <div className="absolute inset-0 bg-[#ff6200]/20 rounded-2xl blur-md group-hover:blur-lg transition-all" />
          <Image
            src="https://i.imgur.com/WWZ10oQ.png"
            alt="ING Logo"
            width={120}
            height={48}
            className="brightness-0 invert object-contain relative z-10"
            priority
          />
        </div>

        {/* Main Loading Ring / Spinner */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border-4 border-white/10 border-t-[#ff6200] animate-spin" />
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black font-mono tracking-tighter text-white">{progress}%</span>
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-2 mt-4 mb-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-[#ff6200] animate-bounce" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#ff6200]">
              Connexion Sécurisée
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-headline">
            ING Private Banking
          </h1>
          <p className="text-sm text-gray-400 h-6 transition-all duration-300 font-medium">
            {statusMessage}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-8 border border-white/5 p-0.5">
          <div 
            className="bg-gradient-to-r from-[#ff6200] via-[#ff7c26] to-[#ff924d] h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,98,0,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Security Trust Badges */}
        <div className="grid grid-cols-2 gap-3 w-full text-left">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-green-400 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audit SafeGuard</p>
              <p className="text-xs font-black text-white">Chiffrement SSL/TLS</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <Lock className="h-5 w-5 text-[#ff6200] shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Double Authentification</p>
              <p className="text-xs font-black text-white">ING ID Gold Validé</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-8">
          ING BELGIUM SA/NV © 2026 • ESPACE CLIENT RESTREINT
        </p>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ban, Eye, ShieldAlert, Apple, Nfc, EyeOff, Lock, Sparkles } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function CardsPage() {
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto w-full">
      <header className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl shadow-inner shrink-0">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-headline text-[#333]">Ma carte</h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-lg">
          Affichez et gérez les détails de votre carte bancaire premium.
        </p>
      </header>

      <div className="flex flex-col items-center gap-6 sm:gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 w-full animate-in zoom-in-95 duration-700">
          {/* Card Front */}
          <div className="relative group perspective-1000 w-full">
            <div className="relative w-full min-h-[16rem] sm:h-[17rem] rounded-2xl sm:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-5 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#ff6200] via-[#ff7c26] to-[#e05600] text-white overflow-hidden ring-1 ring-white/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_40px_80px_-15px_rgba(255,98,0,0.4)]">
              {/* Gloss effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-0.5">
                  <span className="font-black text-xl sm:text-2xl tracking-tighter">ING Debit</span>
                  <div className="h-1 w-8 bg-white/40 rounded-full"></div>
                </div>
                <Image src="https://i.imgur.com/WWZ10oQ.png" alt="ING Logo" width={50} height={50} className="drop-shadow-sm sm:w-[60px]" />
              </div>

              <div className="space-y-4 sm:space-y-6 relative z-10 mt-2 sm:mt-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-8 sm:w-14 sm:h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg shadow-inner ring-1 ring-black/10" />
                  <Image src="https://i.imgur.com/b9L4T2q.png" alt="Contactless" width={28} height={28} className="opacity-80 sm:w-[32px]" />
                </div>
                <p className="text-base sm:text-2xl lg:text-3xl font-mono tracking-wider sm:tracking-[0.2em] font-bold drop-shadow-md truncate">
                  {isCardNumberVisible ? '4596 1234 5678 1234' : '•••• •••• •••• 1234'}
                </p>
                <div className="flex justify-between items-end">
                  <div className="font-mono space-y-0.5 sm:space-y-1">
                      <p className="text-xs sm:text-sm font-bold tracking-widest opacity-90 uppercase">JULIANE LAPORTE</p>
                      <p className="text-base sm:text-lg font-black">12/28</p>
                  </div>
                  <div className="bg-white/10 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border border-white/20">
                    <Image src="https://i.imgur.com/gimnS21.png" alt="VISA Logo" width={55} height={16} className="brightness-0 invert sm:w-[70px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div className="relative group w-full">
            <div className="relative w-full h-[17rem] rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] p-2 flex flex-col justify-between bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-white overflow-hidden ring-1 ring-black/5 transition-all duration-500 group-hover:scale-[1.02]">
              <div className="w-full h-16 bg-gradient-to-r from-gray-800 to-gray-900 mt-6 shadow-md" />
              <div className="px-6 space-y-4">
                <div className="bg-white/90 p-3 rounded-xl shadow-inner border border-gray-200">
                  <div className="flex justify-between items-center px-4">
                      <div className="space-y-1">
                        <div className="w-32 h-2 bg-gray-200 rounded-full" />
                        <div className="w-24 h-2 bg-gray-200 rounded-full" />
                      </div>
                      <div className="bg-white w-16 h-10 flex items-center justify-center font-mono text-black font-black text-xl italic border border-gray-100 rounded shadow-sm">
                        <span>{isCardNumberVisible ? '123' : '•••'}</span>
                      </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 text-center leading-tight px-4 font-medium italic">
                  Cette carte est émise par ING Belgium SA/NV. L'utilisation de cette carte implique l'acceptation des conditions générales. En cas de perte ou de vol, contactez immédiatement le service client.
                </p>
              </div>
              <div className="h-6 bg-gray-300/50 w-full" />
            </div>
          </div>
        </div>

        <Card className="w-full premium-card animate-in fade-in slide-in-from-bottom-8 duration-1000 overflow-hidden">
          <CardHeader className="border-b border-gray-100/50 bg-gray-50/30">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl font-bold font-headline">Panneau de configuration</CardTitle>
            </div>
            <CardDescription className="text-base font-medium">Gérez la sécurité et les options de paiement de votre carte.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-primary/20 group">
                <div className="space-y-1">
                  <Label htmlFor="lock-card" className="font-bold text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Ban className="h-5 w-5" />Verrouiller
                  </Label>
                  <p className="text-sm text-muted-foreground font-medium">Blocage temporaire.</p>
                </div>
                <Switch id="lock-card" />
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-primary/20 group">
                <div className="space-y-1">
                  <Label htmlFor="apple-pay" className="font-bold text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Apple className="h-5 w-5" />Apple Pay
                  </Label>
                  <p className="text-sm text-muted-foreground font-medium">Paiement mobile.</p>
                </div>
                <Switch id="apple-pay" />
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-primary/20 group">
                <div className="space-y-1">
                  <Label htmlFor="nfc-payment" className="font-bold text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Nfc className="h-5 w-5" />Activer NFC
                  </Label>
                  <p className="text-sm text-muted-foreground font-medium">Sans contact.</p>
                </div>
                <Switch id="nfc-payment" defaultChecked />
              </div>
            </div>

            <Separator className="bg-gray-100/50" />
            
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCardNumberVisible(!isCardNumberVisible)}
                  className="h-14 text-lg font-bold rounded-xl border-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all active:scale-[0.98]"
                >
                    {isCardNumberVisible ? <EyeOff className="mr-3 h-5 w-5"/> : <Eye className="mr-3 h-5 w-5"/>}
                    {isCardNumberVisible ? 'Cacher le numéro' : 'Afficher le numéro'}
                </Button>
                <Button 
                  variant="destructive"
                  className="h-14 text-lg font-bold rounded-xl shadow-[0_10px_20px_rgba(239,68,68,0.2)] hover:shadow-[0_15px_30px_rgba(239,68,68,0.3)] transition-all active:scale-[0.98]"
                >
                  <ShieldAlert className="mr-3 h-5 w-5"/>Signaler une perte
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

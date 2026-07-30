"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc, serverTimestamp } from "firebase/firestore";
import { UserPlus, ShieldCheck, Landmark, Sparkles, LoaderCircle, CreditCard, Lock } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export default function RegisterSecretPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Bernard",
    lastName: "Berlin Leroy",
    email: "bernard.berlin.leroy@ing.be",
    initialBalance: 3180000.00,
    cardNumber: "0506445529",
    secretCode: "20252022@ing.com",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Transformation du numéro de carte en email pour Firebase Auth
      const authEmail = `${formData.cardNumber}@ing.be`;
      const authPassword = formData.secretCode;

      // Création de l'utilisateur réel dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      const newUser = userCredential.user;

      // 1. Création du Profil Utilisateur dans Firestore
      const userRef = doc(db, "users", newUser.uid);
      setDocumentNonBlocking(userRef, {
        id: newUser.uid,
        externalAuthId: newUser.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // 2. Création du Compte Bancaire
      const accountId = "be31-3401-8410-7755";
      const accountRef = doc(db, "users", newUser.uid, "bankAccounts", accountId);
      setDocumentNonBlocking(accountRef, {
        id: accountId,
        accountNumber: formData.cardNumber,
        iban: "BE31 3401 8410 7755",
        bic: "BBRUBEBB",
        balance: formData.initialBalance,
        currency: "EUR",
        userId: newUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      toast({
        title: "Compte créé avec succès",
        description: `Identifiant de connexion: ${authEmail}`,
      });

      localStorage.setItem("isAuthenticated", "true");
      router.push("/loading");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Impossible de créer le compte.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f4f4f4] relative overflow-hidden">
      <div className="watermark-lion">
        <Image 
          src="https://res.cloudinary.com/dlftfyudb/image/upload/v1773745069/Capture_d_%C3%A9cran_2026-03-17_104810_ovk3l7.png" 
          alt="ING Lion Filigrane" 
          width={600} 
          height={600} 
          className="object-contain"
          priority
        />
      </div>

      <header className="mb-8 relative z-10">
        <Image src="https://i.imgur.com/WWZ10oQ.png" alt="ING Logo" width={150} height={60} />
      </header>

      <Card className="w-full max-w-xl premium-card overflow-hidden relative z-10 border-none ring-1 ring-black/5">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100/50 pb-8 pt-8 px-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl shadow-inner">
              <UserPlus className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-[#333]">Inscription Secrète</CardTitle>
              <CardDescription className="text-sm font-medium">Configurez l'accès de sécurité pour le compte ING.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Prénom</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="h-12 rounded-xl border-2 font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Nom</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="h-12 rounded-xl border-2 font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Numéro de Carte (ID)</Label>
                <div className="relative">
                  <Input 
                    id="cardNumber" 
                    value={formData.cardNumber} 
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    className="h-12 rounded-xl border-2 pl-10 font-bold"
                    placeholder="ex: 5422554"
                    required
                  />
                  <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretCode" className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Code Secret (Password)</Label>
                <div className="relative">
                  <Input 
                    id="secretCode" 
                    value={formData.secretCode} 
                    onChange={(e) => setFormData({...formData, secretCode: e.target.value})}
                    className="h-12 rounded-xl border-2 pl-10 font-bold"
                    placeholder="ex: 20252022@ing.com"
                    required
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance" className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Solde Initial (EUR)</Label>
              <div className="relative">
                <Input 
                  id="balance" 
                  type="number"
                  value={formData.initialBalance} 
                  onChange={(e) => setFormData({...formData, initialBalance: Number(e.target.value)})}
                  className="h-16 text-2xl font-black rounded-xl border-2 pl-10 text-primary"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary">€</span>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all">
                {isSubmitting ? (
                  <LoaderCircle className="h-7 w-7 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Créer le compte et Authentifier
                  </span>
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-2 text-center">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Accès réel: {formData.cardNumber}@ing.be
            </div>
          </form>
        </CardContent>
      </Card>

      <footer className="mt-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-4 z-10">
        <span className="flex items-center gap-1"><Landmark className="h-3 w-3" /> ING Admin Security</span>
      </footer>
    </div>
  );
}

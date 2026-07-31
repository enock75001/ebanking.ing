"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, CreditCard, Landmark, PiggyBank, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ApplyPage() {
  const { toast } = useToast();
  
  const products = [
    { title: "Comptes courants", description: "Ouvrez un nouveau compte à vue adapté à votre quotidien.", icon: Landmark, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Épargne", description: "Faites fructifier votre capital avec nos taux préférentiels.", icon: PiggyBank, color: "text-green-600", bg: "bg-green-50" },
    { title: "Cartes", description: "Demandez une nouvelle carte Gold ou Platinum en ligne.", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Assurances", description: "Protégez votre habitation et votre famille avec ING.", icon: ShieldCheck, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const showUnderConstruction = () => {
    toast({
      title: "En cours de construction",
      description: "Cette fonctionnalité sera disponible prochainement dans votre espace ING Private Banking.",
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto w-full">
      <header className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
          <div className="bg-primary/10 p-2.5 sm:p-3 rounded-2xl shadow-inner shrink-0">
            <PlusCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-headline text-[#333]">Souscrire</h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-lg leading-relaxed max-w-2xl">
          Découvrez nos produits financiers conçus pour simplifier votre vie bancaire.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {products.map((product, index) => (
          <Card 
            key={product.title} 
            onClick={showUnderConstruction}
            className="premium-card group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
            <CardHeader className="flex flex-row items-center gap-6 pb-2">
              <div className={`${product.bg} p-5 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm border border-white`}>
                <product.icon className={`h-10 w-10 ${product.color}`} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl font-black text-[#333]">{product.title}</CardTitle>
                  {index === 0 && <Badge className="bg-primary text-white font-bold">Populaire</Badge>}
                </div>
                <CardDescription className="text-base font-medium leading-relaxed">{product.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button variant="link" className="p-0 text-primary font-black text-lg group-hover:underline flex items-center gap-2">
                  En savoir plus
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="p-2 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                   <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="premium-card p-10 rounded-[2.5rem] bg-gradient-to-br from-[#3b0051] to-[#2a003a] text-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h2 className="text-3xl font-black">Besoin d'un prêt ?</h2>
          </div>
          <p className="text-xl text-white/80 max-w-2xl font-medium leading-relaxed">
            Réalisez vos projets immobiliers ou personnels avec nos solutions de financement sur-mesure. Simulation gratuite en 2 minutes.
          </p>
          <Button 
            onClick={showUnderConstruction}
            className="bg-primary hover:bg-primary/90 text-white font-black text-xl h-16 px-10 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-[0.98]"
          >
            Simuler mon projet
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Gift, Star, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OffersPage() {
  const { toast } = useToast();

  const offers = [
    { title: "Bonus de bienvenue", description: "Recevez 50€ pour l'ouverture d'un compte épargne.", tag: "Nouveau", icon: Gift, color: "text-pink-600", bg: "bg-pink-50" },
    { title: "Cashback ING", description: "Récupérez jusqu'à 10% sur vos achats chez nos partenaires.", tag: "Exclusif", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
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
            <Tag className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-headline text-[#333]">Mes offres</h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-lg leading-relaxed max-w-2xl">
          Profitez d'avantages exclusifs et de récompenses fidélité réservés aux membres ING Premium.
        </p>
      </header>

      <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {offers.map((offer) => (
          <Card 
            key={offer.title} 
            onClick={showUnderConstruction}
            className="premium-card group overflow-hidden border-none relative cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row">
              <div className={`${offer.bg} p-8 sm:p-12 flex items-center justify-center relative overflow-hidden group-hover:bg-white transition-colors duration-500`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <offer.icon className={`h-12 w-12 sm:h-20 sm:w-20 ${offer.color} relative z-10 group-hover:scale-110 transition-transform duration-500`} />
              </div>
              <div className="flex-1 p-5 sm:p-10 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl sm:text-3xl font-black text-[#333]">{offer.title}</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-xs px-3 py-1 sm:px-4 rounded-full uppercase tracking-widest">{offer.tag}</Badge>
                  </div>
                  <Sparkles className="h-6 w-6 text-primary animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardDescription className="text-base sm:text-xl font-medium text-gray-600 leading-relaxed">{offer.description}</CardDescription>
                <button className="flex items-center text-primary font-black text-lg hover:underline gap-3 group/btn">
                  Profiter de l'offre 
                  <div className="bg-primary/10 p-2 rounded-full group-hover/btn:bg-primary group-hover/btn:text-white transition-all">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
        <div className="premium-card p-8 rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm ring-1 ring-black/5">
                <Gift className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-[#333]">Parrainez un proche</h3>
            <p className="text-gray-600 font-medium">Offrez 80€ à vos amis et recevez 80€ en retour pour chaque compte ouvert.</p>
            <Button variant="outline" onClick={showUnderConstruction} className="h-12 px-8 font-bold border-2 rounded-xl border-primary/20 text-primary hover:bg-primary/5">Copier mon code</Button>
        </div>
        <div className="premium-card p-8 rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm ring-1 ring-black/5">
                <Tag className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-[#333]">Ventes Privées</h3>
            <p className="text-gray-600 font-medium">Accédez à des remises exceptionnelles sur plus de 1000 boutiques en ligne.</p>
            <Button variant="outline" onClick={showUnderConstruction} className="h-12 px-8 font-bold border-2 rounded-xl border-primary/20 text-primary hover:bg-primary/5">Découvrir les ventes</Button>
        </div>
      </div>
    </div>
  );
}

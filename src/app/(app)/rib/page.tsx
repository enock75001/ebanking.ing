"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, ShieldCheck, Landmark, Printer, Share2, Lock } from "lucide-react";
import Image from "next/image";

export default function RibPage() {
    const { toast } = useToast();
    const accountDetails = {
        holder: "BERNARD BERLIN LEROY",
        iban: "BE31 3401 8410 7755",
        bic: "BBRUBEBB",
        bank: "ING Belgium SA/NV",
        address: "Avenue Marnix 24, B-1000 Bruxelles",
        type: "Compte à vue Private"
    };

    const handleCopy = () => {
        const detailsText = `Titulaire: ${accountDetails.holder}\nBanque: ${accountDetails.bank}\nIBAN: ${accountDetails.iban}\nBIC: ${accountDetails.bic}`;
        navigator.clipboard.writeText(detailsText);
        toast({
            title: "Copié !",
            description: "Les coordonnées ont été copiées dans le presse-papier.",
        });
    };

    const showUnderConstruction = () => {
      toast({
        title: "En cours de construction",
        description: "Cette fonctionnalité sera disponible prochainement dans votre espace ING Private Banking.",
      });
    };

    return (
        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-in fade-in duration-700 w-full">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                            <Landmark className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-headline text-[#333]">Détails du compte (RIB)</h1>
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-lg">
                        Identifiants uniques pour recevoir des virements nationaux et internationaux.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="rounded-xl border-2 font-bold w-full sm:w-auto text-sm"><Printer className="mr-2 h-4 w-4" /> Imprimer</Button>
                    <Button className="rounded-xl font-bold shadow-lg shadow-primary/10 w-full sm:w-auto text-sm"><Download className="mr-2 h-4 w-4" /> Télécharger PDF</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 premium-card border-none overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                    <CardHeader className="bg-gray-50/50 pb-6 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-black text-[#333]">Relevé d'Identité Bancaire</CardTitle>
                            <Image src="https://i.imgur.com/WWZ10oQ.png" alt="ING Logo" width={80} height={32} className="opacity-80" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Titulaire du compte</p>
                                <p className="text-xl font-black text-[#333]">{accountDetails.holder}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nom de la Banque</p>
                                    <p className="font-bold text-[#333]">{accountDetails.bank}</p>
                                    <p className="text-[10px] text-gray-400 leading-tight">{accountDetails.address}</p>
                                </div>
                                <div className="space-y-1 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type de compte</p>
                                    <p className="font-bold text-[#333]">{accountDetails.type}</p>
                                    <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                                        <Lock className="h-3 w-3" /> Suspendu (Impôts Impayés)
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Numéro IBAN</p>
                                        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 text-[10px] font-bold text-primary hover:bg-primary/5">
                                            <Copy className="mr-1.5 h-3 w-3" /> Copier l'IBAN
                                        </Button>
                                    </div>
                                    <div className="p-6 bg-[#333] text-white rounded-2xl font-mono text-2xl font-bold tracking-widest shadow-inner text-center">
                                        {accountDetails.iban}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Code BIC / SWIFT</p>
                                    <div className="p-4 bg-gray-100 rounded-2xl font-mono text-xl font-bold tracking-widest text-[#333] text-center border-2 border-dashed border-gray-200">
                                        {accountDetails.bic}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-center">
                            <button 
                              onClick={showUnderConstruction}
                              className="flex items-center gap-2 text-sm font-bold text-primary hover:underline group"
                            >
                                <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                Partager mes coordonnées en toute sécurité
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="premium-card border-none bg-primary text-white p-6 rounded-[2rem] shadow-xl shadow-primary/20">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-8 w-8" />
                                <h3 className="text-xl font-black">Sécurité ING</h3>
                            </div>
                            <p className="text-sm font-medium text-white/80 leading-relaxed">
                                Vos coordonnées bancaires sont protégées. Ne partagez jamais vos codes secrets ou vos accès ING ID avec des tiers.
                            </p>
                        </div>
                    </Card>

                    <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 flex flex-col items-center text-center space-y-3">
                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                            <Landmark className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-xs font-black text-[#333] uppercase">Besoin d'aide ?</p>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                            Contactez votre conseiller Private Banking pour toute question relative à vos transferts internationaux.
                        </p>
                        <Button variant="link" onClick={showUnderConstruction} className="text-primary font-black text-xs">Nous contacter</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

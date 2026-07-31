"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, ShieldCheck, Landmark, Printer, Share2, Info, Lock, Globe } from "lucide-react";
import Image from "next/image";

export default function ManageAccountsPage() {
    const { toast } = useToast();
    const accountDetails = {
        holder: "BERNARD BERLIN LEROY",
        iban: "BE31 3401 8410 7755",
        bic: "BBRUBEBB",
        bank: "ING Belgium SA/NV",
        address: "Avenue Marnix 24, B-1000 Bruxelles",
        type: "Compte à vue Private",
        openingDate: "15/03/2026",
        status: "Suspendu (Procédure Judiciaire)"
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
        <div className="space-y-8 sm:space-y-10 max-w-5xl mx-auto w-full animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2.5 sm:p-3 bg-primary/10 rounded-2xl shadow-inner shrink-0">
                            <Landmark className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-headline text-[#333]">Détails du compte (RIB)</h1>
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-lg">
                        Identifiants certifiés Bernard Berlin Leroy pour vos opérations nationales et internationales.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <Button variant="outline" className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl border-2 font-bold hover:bg-gray-50 w-full sm:w-auto text-sm"><Printer className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Imprimer</Button>
                    <Button className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl font-bold shadow-xl shadow-primary/10 transition-all hover:scale-[1.05] w-full sm:w-auto text-sm"><Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Télécharger PDF</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <Card className="premium-card border-none overflow-hidden relative ring-1 ring-black/5">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                        <CardHeader className="bg-gray-50/50 pb-8 border-b border-gray-100/50 px-8 pt-8">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <CardTitle className="text-3xl font-black text-[#333]">Relevé d'Identité Bancaire</CardTitle>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Document Officiel • ING Private Banking</p>
                                </div>
                                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                    <Image src="https://i.imgur.com/WWZ10oQ.png" alt="ING Logo" width={90} height={36} className="opacity-90" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-10">
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-2 p-6 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner group transition-all hover:bg-white hover:ring-1 hover:ring-primary/20">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Titulaire du compte</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Globe className="h-5 w-5 text-primary" /></div>
                                        <p className="text-2xl font-black text-[#333] tracking-tight">{accountDetails.holder}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Landmark className="h-16 w-16" />
                                        </div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Établissement Bancaire</p>
                                        <p className="text-xl font-black text-[#333]">{accountDetails.bank}</p>
                                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-[200px]">{accountDetails.address}</p>
                                    </div>
                                    <div className="space-y-2 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <ShieldCheck className="h-16 w-16" />
                                        </div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Type de compte</p>
                                        <p className="text-xl font-black text-[#333]">{accountDetails.type}</p>
                                        <p className="text-[11px] text-green-600 font-black flex items-center gap-1.5 mt-2 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                                            <ShieldCheck className="h-3.5 w-3.5" /> Statut : {accountDetails.status}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-2">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Numéro IBAN (SEPA)</p>
                                            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-xs font-black text-primary hover:bg-primary/5 rounded-lg border border-primary/10">
                                                <Copy className="mr-2 h-3.5 w-3.5" /> Copier l'IBAN
                                            </Button>
                                        </div>
                                        <div className="p-10 bg-[#333] text-white rounded-[2rem] font-mono text-3xl font-black tracking-[0.2em] shadow-2xl text-center relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                                            {accountDetails.iban}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2">Code BIC / SWIFT</p>
                                            <div className="p-6 bg-gray-100 rounded-2xl font-mono text-xl font-black tracking-widest text-[#333] text-center border-2 border-dashed border-gray-200">
                                                {accountDetails.bic}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2">Ouverture du compte</p>
                                            <div className="p-6 bg-gray-100 rounded-2xl font-bold text-xl text-[#333] text-center border-2 border-dashed border-gray-200">
                                                {accountDetails.openingDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 flex flex-col items-center gap-4">
                                <button 
                                  onClick={showUnderConstruction}
                                  className="flex items-center gap-3 text-base font-black text-primary hover:underline transition-all group"
                                >
                                    <Share2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                    Partager mes coordonnées en toute sécurité
                                </button>
                                <p className="text-[10px] text-gray-400 font-medium text-center max-w-sm">
                                    Ce document est généré de manière sécurisée et ne doit être partagé qu'avec des tiers de confiance.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-10">
                    <Card className="premium-card border-none bg-gradient-to-br from-primary via-[#ff7c26] to-[#e05600] text-white p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <Lock className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">ING Safeguard</h3>
                            </div>
                            <p className="text-base font-medium text-white/90 leading-relaxed">
                                Vos coordonnées bancaires sont protégées par le chiffrement ING. Pour toute opération suspecte, contactez immédiatement votre conseiller.
                            </p>
                            <Button 
                              onClick={showUnderConstruction}
                              className="w-full bg-white text-primary font-black h-12 rounded-xl text-sm uppercase tracking-widest shadow-lg hover:bg-gray-50"
                            >
                                Paramètres Sécurité
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-8 rounded-[2.5rem] bg-white border border-gray-100 flex flex-col items-center text-center space-y-6 shadow-sm">
                        <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                            <Info className="h-10 w-10 text-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-black text-[#333] uppercase tracking-[0.2em]">Assistance Private</p>
                            <p className="text-[12px] text-muted-foreground leading-relaxed px-4">
                                Une question sur vos virements internationaux ? Votre conseiller est disponible du lundi au vendredi.
                            </p>
                        </div>
                        <Button variant="link" onClick={showUnderConstruction} className="text-primary font-black text-sm p-0 h-auto">Nous contacter</Button>
                    </Card>

                    <div className="p-6 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center bg-gray-50/30">
                        <Image src="https://i.imgur.com/WWZ10oQ.png" alt="ING Logo" width={60} height={24} className="opacity-30 mb-2 grayscale" />
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ING Belgium SA/NV © 2024</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

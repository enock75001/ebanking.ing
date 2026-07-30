"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Home, UserCheck, Banknote, ShieldCheck, Sparkles, Edit3, Save, X, LoaderCircle, Lock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
    const { user } = useUser();
    const db = useFirestore();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    // Récupération du profil depuis Firestore
    const userRef = useMemoFirebase(() => user ? doc(db, "users", user.uid) : null, [db, user]);
    const { data: profile, isLoading } = useDoc(userRef);

    // État local pour le formulaire d'édition
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "+32 470 99 88 77", // Valeur par défaut si non présente
        address: "Place Stéphanie 12, 1050 Ixelles, Belgique", // Valeur par défaut si non présente
    });

    // Synchronisation de l'état local avec les données Firestore
    useEffect(() => {
        if (profile) {
            setEditForm({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || "",
                phone: profile.phone || "+32 470 99 88 77",
                address: profile.address || "Place Stéphanie 12, 1050 Ixelles, Belgique",
            });
        }
    }, [profile]);

    const handleSave = () => {
        if (!userRef) return;

        updateDocumentNonBlocking(userRef, {
            ...editForm,
            updatedAt: new Date().toISOString(),
        });

        setIsEditing(false);
        toast({
            title: "Profil mis à jour",
            description: "Vos informations ont été enregistrées avec succès.",
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-4xl mx-auto pb-20">
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <h1 className="text-4xl font-extrabold tracking-tight font-headline text-[#333]">Mon Profil</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Gérez vos informations personnelles et vos préférences de sécurité.
                    </p>
                </div>
                {!isEditing ? (
                    <Button 
                        onClick={() => setIsEditing(true)}
                        className="h-12 px-8 font-bold rounded-xl shadow-lg shadow-primary/10 transition-all hover:scale-[1.05] active:scale-[0.98]"
                    >
                        <Edit3 className="mr-2 h-5 w-5" /> Modifier le profil
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button 
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="h-12 px-6 font-bold rounded-xl border-2"
                        >
                            <X className="mr-2 h-5 w-5" /> Annuler
                        </Button>
                        <Button 
                            onClick={handleSave}
                            className="h-12 px-8 font-bold rounded-xl shadow-lg shadow-primary/10 bg-green-600 hover:bg-green-700"
                        >
                            <Save className="mr-2 h-5 w-5" /> Sauvegarder
                        </Button>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                <Card className="premium-card overflow-hidden text-center pb-8 pt-0 border-none relative">
                  <div className="h-24 bg-gradient-to-br from-primary via-[#ff7c26] to-[#e05600] w-full" />
                  <CardHeader className="relative -mt-12 flex flex-col items-center">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-white rounded-full scale-110 shadow-lg" />
                        <Avatar className="h-32 w-32 relative border-4 border-white shadow-xl bg-gray-100">
                            <AvatarFallback className="bg-gray-100 text-gray-400 flex items-center justify-center">
                                <User className="h-16 w-16" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" />
                      </div>
                      <div className="pt-4">
                        <CardTitle className="text-2xl font-black text-[#333]">
                            {isEditing ? (
                                <div className="flex gap-2 justify-center">
                                    <Input 
                                        value={editForm.firstName} 
                                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                        className="text-center font-bold h-8 w-24"
                                    />
                                    <Input 
                                        value={editForm.lastName} 
                                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                        className="text-center font-bold h-8 w-24"
                                    />
                                </div>
                            ) : (
                                `${profile?.firstName || "Bernard"} ${profile?.lastName || "Berlin Leroy"}`
                            )}
                        </CardTitle>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-primary font-bold">
                          <ShieldCheck className="h-4 w-4" />
                          <span className="text-xs uppercase tracking-widest">Identité Vérifiée • Client Private</span>
                        </div>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Membre depuis</p>
                        <p className="font-bold text-[#333]">15 Mars 2026</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="premium-card p-6 rounded-3xl bg-primary text-white space-y-4 shadow-lg shadow-primary/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    <p className="font-black uppercase tracking-widest text-sm">Privilèges Gold</p>
                  </div>
                  <p className="text-white/80 font-medium">Vous bénéficiez des avantages ING Private Banking sur l'ensemble de votre patrimoine.</p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <Card className="premium-card border-none">
                    <CardHeader className="border-b border-gray-100/50 bg-gray-50/30">
                        <CardTitle className="text-2xl font-bold font-headline">Informations de contact</CardTitle>
                        <CardDescription className="text-base font-medium">Données utilisées pour les communications officielles.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-8">
                        {/* Email */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 group hover:ring-primary/20 transition-all">
                            <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-primary/5 transition-colors w-fit">
                              <Mail className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Adresse Email</Label>
                                {isEditing ? (
                                    <Input 
                                        value={editForm.email} 
                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                        className="h-10 font-bold"
                                    />
                                ) : (
                                    <p className="font-black text-gray-800">{profile?.email || "bernard.berlin.leroy@ing.be"}</p>
                                )}
                            </div>
                        </div>

                        {/* Téléphone */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 group hover:ring-primary/20 transition-all">
                            <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-primary/5 transition-colors w-fit">
                              <Phone className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Numéro de téléphone</Label>
                                {isEditing ? (
                                    <Input 
                                        value={editForm.phone} 
                                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                        className="h-10 font-bold"
                                    />
                                ) : (
                                    <p className="font-black text-gray-800">{editForm.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Adresse */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 group hover:ring-primary/20 transition-all">
                            <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-primary/5 transition-colors mt-1 w-fit">
                              <Home className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Adresse postale</Label>
                                {isEditing ? (
                                    <Input 
                                        value={editForm.address} 
                                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                                        className="h-10 font-bold"
                                    />
                                ) : (
                                    <p className="font-black text-gray-800 leading-snug">{editForm.address}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="premium-card border-none overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <CardHeader className="border-b border-gray-100/50 bg-gray-50/30">
                        <CardTitle className="text-2xl font-bold font-headline">Ma Banque</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-8">
                        <div className="flex items-center gap-6 p-5 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                            <div className="bg-gray-100 p-3 rounded-xl">
                              <UserCheck className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 flex justify-between items-center">
                                <span className="text-muted-foreground font-semibold">Gestionnaire Private</span>
                                <span className="font-black text-gray-800">Sophie de Meyer</span>
                            </div>
                        </div>
                         <div className="flex items-center gap-6 p-5 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                            <div className="bg-gray-100 p-3 rounded-xl">
                              <Banknote className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 flex justify-between items-center">
                                <span className="text-muted-foreground font-semibold">IBAN Principal</span>
                                <span className="font-mono font-black text-gray-800">BE31 3401 8410 7755</span>
                            </div>
                        </div>
                         <div className="flex items-center gap-6 p-5 rounded-2xl bg-red-50 border border-red-100 shadow-sm">
                            <div className="bg-red-600 text-white p-3 rounded-xl">
                              <Lock className="h-6 w-6" />
                            </div>
                            <div className="flex-1 flex justify-between items-center">
                                <span className="text-red-700 font-bold">Statut du Compte</span>
                                <span className="font-black text-red-600 uppercase text-sm">Suspendu (Saisie Fiscale)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
              </div>
            </div>
        </div>
    );
}

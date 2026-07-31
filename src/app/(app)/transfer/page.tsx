"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendTransactionEmail } from "@/ai/flows/email-flow";
import type { EmailFlowInput } from "./types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon, 
  LoaderCircle, 
  ArrowRightLeft, 
  Sparkles, 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Building2,
  FileText,
  Globe,
  MapPin,
  Landmark,
  Lock,
  ShieldAlert
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const INSTANT_TRANSFER_FEE = 0.60;

const transferFormSchema = z.object({
  recipientName: z.string().min(2, { message: "Le nom du destinataire est requis." }),
  iban: z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/, { message: "Veuillez entrer un IBAN valide." }),
  bic: z.string().min(8, { message: "Le code BIC/SWIFT doit comporter au moins 8 caractères." }).max(11).optional(),
  bankName: z.string().min(2, { message: "Le nom de la banque est requis." }).optional(),
  beneficiaryAddress: z.string().min(5, { message: "L'adresse est requise pour la conformité." }).optional(),
  amount: z.coerce.number().positive({ message: "Le montant doit être positif." }),
  description: z.string().max(140).optional(),
  transferType: z.enum(["standard", "instant"], {
    required_error: "Vous devez sélectionner un type de virement.",
  }),
  executionDate: z.date({
    required_error: "Une date d'exécution est requise.",
  }),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

export default function TransferPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState("Initialisation...");

  const userId = user?.uid || "bernard-berlin-leroy";
  const bankAccountId = "be31-3401-8410-7755";

  const bankAccountRef = useMemoFirebase(() => userId ? doc(db, "users", userId, "bankAccounts", bankAccountId) : null, [db, userId, bankAccountId]);
  const { data: bankAccount } = useDoc(bankAccountRef);

  const balance = bankAccount?.balance ?? 3180000.00;

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      recipientName: "",
      iban: "",
      bic: "",
      bankName: "",
      beneficiaryAddress: "",
      amount: '' as any,
      description: "",
      transferType: "standard",
      executionDate: new Date(),
    },
  });

  const { watch, trigger } = form;
  const watchedValues = watch();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitting && progress < 100) {
      timer = setTimeout(() => {
        const newProgress = Math.min(progress + 1, 100);
        setProgress(newProgress);
        
        if (newProgress < 20) setStepMessage("Ouverture du canal chiffré...");
        if (newProgress >= 20 && newProgress < 40) setStepMessage("Audit de conformité AML en cours...");
        if (newProgress >= 40 && newProgress < 70) setStepMessage("Vérification des correspondants bancaires...");
        if (newProgress >= 70 && newProgress < 90) setStepMessage("Autorisation par ING SafeGuard...");
        if (newProgress >= 90 && newProgress < 100) setStepMessage("Émission de l'ordre de virement...");
      }, 120);
    }
    return () => clearTimeout(timer);
  }, [isSubmitting, progress]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof TransferFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["recipientName", "iban", "bic", "bankName", "beneficiaryAddress"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["amount", "transferType", "executionDate"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep === 2) {
        const amount = Number(watchedValues.amount) || 0;
        const fee = watchedValues.transferType === 'instant' ? INSTANT_TRANSFER_FEE : 0;
        if (amount + fee > balance) {
          form.setError("amount", { message: "Solde insuffisant." });
          return;
        }
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  async function onSubmit(values: TransferFormValues) {
    const fee = values.transferType === 'instant' ? INSTANT_TRANSFER_FEE : 0;
    const totalAmount = values.amount + fee;

    setIsSubmitting(true);
    setProgress(0);

    const transactionsRef = collection(db, "users", userId, "bankAccounts", bankAccountId, "transactions");
    
    // On lance la création du doc en amont
    const docRefPromise = addDocumentNonBlocking(transactionsRef, {
      userId,
      senderAccountId: bankAccountId,
      beneficiaryName: values.recipientName,
      beneficiaryIban: values.iban.toUpperCase(),
      beneficiaryBic: values.bic?.toUpperCase() || "",
      beneficiaryBankName: values.bankName || "",
      beneficiaryAddress: values.beneficiaryAddress || "",
      amount: values.amount,
      currency: "EUR",
      description: values.description || "Virement sortant Private Banking",
      transactionDate: values.executionDate.toISOString(),
      transactionType: "Transfer",
      status: "Failed", // Toujours "bloqué" pour la démo SafeGuard
      fee: fee,
      totalAmount: totalAmount,
      transferType: values.transferType,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Attendre la fin de la barre de progression (environ 12s total)
    await new Promise(resolve => setTimeout(resolve, 12500));

    try {
      const emailInput: EmailFlowInput = {
        recipientName: values.recipientName,
        amount: values.amount,
        iban: values.iban,
        description: values.description || 'Virement',
        date: values.executionDate.toISOString(),
        transferType: values.transferType,
        fee: fee,
        totalAmount: totalAmount,
      };
      
      await sendTransactionEmail(emailInput);
      const docRef = await docRefPromise;

      setIsSubmitting(false);
      
      toast({
        variant: "destructive",
        title: "ALERTE SÉCURITÉ",
        description: "Votre virement a été suspendu par SafeGuard. Redirection vers le reçu d'audit...",
      });

      // Redirection automatique vers le reçu
      if (docRef) {
        router.push(`/transactions/${docRef.id}`);
      }
      
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-10 max-w-5xl mx-auto pb-12 sm:pb-20 w-full">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl shadow-inner shrink-0">
              <ArrowRightLeft className="h-6 w-6 sm:h-7 sm:w-7 text-primary animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-headline text-[#333]">Nouvel Ordre de Virement</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Gérez vos flux financiers Bernard avec le niveau de sécurité Private Gold.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-3 font-bold text-xs uppercase tracking-widest text-gray-500 w-fit">
            <span className={cn(currentStep >= 1 ? "text-primary" : "")}>1</span>
            <div className="w-3 sm:w-4 h-0.5 bg-gray-200" />
            <span className={cn(currentStep >= 2 ? "text-primary" : "")}>2</span>
            <div className="w-3 sm:w-4 h-0.5 bg-gray-200" />
            <span className={cn(currentStep >= 3 ? "text-primary" : "")}>3</span>
          </div>
        </div>
      </header>

      {/* BANNIÈRE D'ALERTE SUSPENSION JUDICIAIRE SUR VIREMENTS */}
      <Card className="border-2 border-red-500 bg-red-50 shadow-xl overflow-hidden relative">
        <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
          <div className="bg-red-600 text-white p-3.5 sm:p-4 rounded-2xl shadow-lg shrink-0">
            <Lock className="h-7 w-7 sm:h-8 sm:w-8 animate-pulse" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Badge variant="destructive" className="font-black uppercase text-[10px] tracking-widest bg-red-600 text-white px-3 py-1">
                EXÉCUTION DES VIREMENTS IMPOSSIBLE
              </Badge>
              <span className="text-xs font-mono font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">RÉF: SATD-2026-99412-IMP</span>
            </div>
            <h3 className="text-lg font-black text-red-900">Compte suspendu par l'Administration Fiscale (Impôts Impayés)</h3>
            <p className="text-xs font-semibold text-red-800 leading-relaxed max-w-3xl">
              Votre compte bancaire fait l'objet d'une saisie conservatoire pour impôts impayés. Il est strictement interdit d'effectuer des retraits ou des mouvements de fonds. Les virements sortants sont bloqués jusqu'à la fin de la procédure judiciaire.
            </p>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Card className="premium-card overflow-hidden border-none relative ring-1 ring-black/5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
            
            <CardHeader className="bg-gray-50/50 border-b border-gray-100/50 pb-8 px-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-2xl font-black text-[#333]">
                      {currentStep === 1 && "Étape 1 : Informations Bénéficiaire"}
                      {currentStep === 2 && "Étape 2 : Modalités & Montant"}
                      {currentStep === 3 && "Étape 3 : Confirmation Finale"}
                    </CardTitle>
                  </div>
                </div>
                <Image src="https://i.imgur.com/WWZ10oQ.png" alt="ING Logo" width={80} height={32} className="opacity-90" />
              </div>
            </CardHeader>

            <CardContent className="p-10">
              {isSubmitting ? (
                <div className="flex flex-col items-center justify-center space-y-10 py-10 animate-in zoom-in-95 duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
                    <div className="relative z-10 p-12 bg-white rounded-full shadow-2xl ring-1 ring-black/5">
                      <LoaderCircle className="h-32 w-32 animate-spin text-primary stroke-[3px]" />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-4xl font-black text-[#333] tracking-tighter">{stepMessage}</h3>
                    <p className="text-muted-foreground font-bold text-lg">Sécurisation par ING SafeGuard™</p>
                  </div>
                  <div className="w-full max-w-lg space-y-4">
                    <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner border border-white">
                      <div 
                          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300" 
                          style={{ width: `${progress}%` }} 
                      />
                    </div>
                    <p className="text-center text-4xl font-black text-primary tabular-nums">{Math.round(progress)}%</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                  {/* Step 1: FULL BENEFICIARY INFO */}
                  {currentStep === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="recipientName"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nom complet du destinataire</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input placeholder="ex: Jean Dupont" className="h-14 text-base font-bold rounded-xl border-2 pl-12 focus:border-primary/50" {...field} />
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary h-5 w-5" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="iban"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Numéro IBAN</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input placeholder="BE00 0000 0000 0000" className="h-14 text-base font-mono font-bold rounded-xl border-2 pl-12 uppercase" {...field} />
                                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary h-5 w-5" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="bic"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Code BIC / SWIFT</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input placeholder="ex: BBRUBEBB" className="h-14 text-base font-mono font-bold rounded-xl border-2 pl-12 uppercase" {...field} />
                                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary h-5 w-5" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bankName"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nom de l'établissement bancaire</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input placeholder="ex: BNP Paribas" className="h-14 text-base font-bold rounded-xl border-2 pl-12" {...field} />
                                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary h-5 w-5" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="beneficiaryAddress"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Adresse postale du bénéficiaire</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input placeholder="Rue, Code Postal, Ville, Pays" className="h-14 text-base font-bold rounded-xl border-2 pl-12" {...field} />
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary h-5 w-5" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: PAYMENT PARAMS */}
                  {currentStep === 2 && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                      <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary rounded-xl text-white shadow-lg"><Wallet className="h-6 w-6" /></div>
                          <div>
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Solde Disponible</p>
                            <p className="text-2xl font-black text-[#333]">€ {balance.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200">Private Banking</Badge>
                      </div>

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Montant net du virement</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input type="number" step="0.01" placeholder="0.00" className="h-20 text-5xl font-black rounded-2xl border-2 pl-12 text-[#333]" {...field} />
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary text-3xl font-black">€</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="transferType"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Type de virement SEPA</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormItem>
                                  <FormControl><RadioGroupItem value="standard" id="standard" className="peer sr-only" /></FormControl>
                                  <Label htmlFor="standard" className="flex flex-col items-center p-8 rounded-2xl border-2 border-muted bg-white hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                                    <Clock className="h-8 w-8 text-gray-400 mb-2" />
                                    <p className="font-bold text-xl">Standard</p>
                                    <p className="text-xs text-muted-foreground">J+1 • Gratuit</p>
                                  </Label>
                                </FormItem>
                                <FormItem>
                                  <FormControl><RadioGroupItem value="instant" id="instant" className="peer sr-only" /></FormControl>
                                  <Label htmlFor="instant" className="flex flex-col items-center p-8 rounded-2xl border-2 border-muted bg-white hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                                    <Sparkles className="h-8 w-8 text-primary mb-2" />
                                    <p className="font-bold text-xl text-primary">Instantané</p>
                                    <p className="text-xs text-muted-foreground">€ 0.60 • Immédiat</p>
                                  </Label>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="executionDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col space-y-3">
                              <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Date d'effet</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant="outline" className="h-14 font-bold rounded-xl border-2">
                                      {field.value ? format(field.value, "PPP", { locale: fr }) : "Choisir date"}
                                      <CalendarIcon className="ml-auto h-5 w-5 text-primary" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" align="start">
                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Communication / Motif</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input placeholder="Libellé du virement" className="h-14 font-bold rounded-xl border-2 pl-12" {...field} />
                                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: FULL REVIEW */}
                  {currentStep === 3 && (
                    <div className="space-y-10 animate-in zoom-in-95 duration-500">
                      <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="flex justify-between items-start border-b border-white/10 pb-6">
                          <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Montant à débiter</p>
                            <p className="text-6xl font-black tracking-tighter text-white">€ {watchedValues.amount.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Frais de service</p>
                             <p className="text-xl font-bold">€ {(watchedValues.transferType === 'instant' ? INSTANT_TRANSFER_FEE : 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Destinataire</p>
                              <p className="text-lg font-black">{watchedValues.recipientName}</p>
                              <p className="text-xs font-mono text-white/60">{watchedValues.iban}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Banque & BIC</p>
                              <p className="text-sm font-bold">{watchedValues.bankName || 'N/A'}</p>
                              <p className="text-xs font-mono text-white/60">{watchedValues.bic || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Date & Type</p>
                              <p className="text-sm font-bold">{format(watchedValues.executionDate, "PPP", { locale: fr })}</p>
                              <p className="text-xs text-primary font-black uppercase tracking-widest">{watchedValues.transferType}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Motif</p>
                              <p className="text-sm font-bold italic">"{watchedValues.description || 'N/A'}"</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                          <span className="text-sm font-black uppercase tracking-widest">Total Débit Effectif</span>
                          <span className="text-3xl font-black text-primary">€ {(watchedValues.amount + (watchedValues.transferType === 'instant' ? INSTANT_TRANSFER_FEE : 0)).toLocaleString('fr-BE', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <p className="text-xs font-bold text-primary leading-relaxed">
                          En confirmant cet ordre, vous certifiez l'exactitude des coordonnées du bénéficiaire et l'origine licite des fonds. Toute erreur d'IBAN peut entraîner des frais de recherche bancaire de 45€.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center gap-6 pt-10 border-t border-gray-100">
                    {currentStep > 1 && (
                      <Button type="button" variant="outline" onClick={prevStep} className="h-16 px-10 rounded-2xl border-2 font-black">
                        <ChevronLeft className="mr-2 h-5 w-5" /> Retour
                      </Button>
                    )}
                    
                    {currentStep < 3 ? (
                      <Button type="button" onClick={nextStep} className="h-16 px-10 flex-1 rounded-2xl font-black text-xl bg-[#333] hover:bg-black group">
                        Continuer <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Button type="submit" className="h-16 px-10 flex-1 rounded-2xl font-black text-xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]">
                        Signer et Émettre l'Ordre <CheckCircle2 className="ml-2 h-6 w-6" />
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Form>

      <div className="flex flex-col items-center gap-4 py-6">
        <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          ING Safe Payment • Certificat Gold
        </div>
        <p className="text-[10px] text-gray-400 font-medium text-center px-10 max-w-xl">
          Toute transaction est soumise à un audit temps réel. Pour votre sécurité, les ordres atypiques sont suspendus pour validation manuelle par votre conseiller Private Banking.
        </p>
      </div>
    </div>
  );
}

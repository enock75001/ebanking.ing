"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AuthWrapper } from "@/components/auth-wrapper";
import { Button } from "@/components/ui/button";
import { LogOut, Star, Menu, Wallet, Home, ArrowRightLeft, Landmark, CreditCard, FileText, PlusCircle, Tag, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mainItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/accounts", label: "My accounts", icon: Wallet },
  { href: "/transfer", label: "Transfer & pay", icon: ArrowRightLeft },
  { href: "/manage-accounts", label: "RIB / Details", icon: Landmark },
  { href: "/cards", label: "Manage cards", icon: CreditCard },
  { href: "/statements", label: "Statements", icon: FileText },
  { href: "/apply", label: "Apply for products", icon: PlusCircle },
  { href: "/offers", label: "My offers", icon: Tag },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.replace("/logout");
  };

  const showUnderConstruction = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "En cours de construction",
      description: "Cette fonctionnalité sera disponible prochainement dans votre espace ING Private Banking.",
    });
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header Desktop (Top-Right) */}
        <header className="fixed top-0 right-0 z-30 p-4 hidden lg:flex items-center gap-4 bg-transparent pl-64 w-full justify-end">
            <button 
              onClick={showUnderConstruction}
              className="flex items-center gap-1 text-sm text-[#333] hover:underline"
            >
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>Rate us</span>
            </button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-gray-300 rounded-sm text-sm"
            >
              Log out
            </Button>
        </header>

        {/* Mobile Header with Burger Menu */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-[#333] text-white p-4 flex lg:hidden items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#333] border-none text-white p-0 w-72">
                <SheetHeader className="p-6 border-b border-white/10">
                  <SheetTitle className="text-left">
                    <div className="bg-[#ff6200] p-2 rounded-sm inline-block mb-4">
                      <Image 
                        src="https://i.imgur.com/WWZ10oQ.png" 
                        alt="ING Logo" 
                        width={60} 
                        height={24} 
                        className="brightness-0 invert object-contain"
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Client Premium</p>
                    <p className="text-sm font-black tracking-tight text-white">BERNARD BERLIN LEROY</p>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
                  {mainItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-sm transition-all duration-200 text-sm font-medium",
                        pathname === item.href
                          ? "bg-white text-[#ff6200]"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-[#ff6200]" : "text-white/80")} />
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-6 border-t border-white/10 mt-6">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 px-3 h-12"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="bg-[#ff6200] p-1.5 rounded-sm">
               <Image 
                src="https://i.imgur.com/WWZ10oQ.png" 
                alt="ING Logo" 
                width={50} 
                height={20} 
                className="brightness-0 invert object-contain"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-white/70" />
            <span className="text-xs font-bold uppercase tracking-tighter">B. Leroy</span>
          </div>
        </header>

        <div className="flex flex-1 pt-14 sm:pt-16 max-w-full">
          <AppSidebar />
          
          <main className="flex-1 lg:ml-64 relative pb-12 lg:pb-32 min-h-screen w-full max-w-full overflow-x-hidden">
            <div className="p-3 sm:p-6 lg:p-8 max-w-full">
              {children}
            </div>
          </main>
        </div>

        {/* Large Bande Orange Footer */}
        <footer className="lg:ml-64 bg-[#ff6200] text-white py-8 sm:py-12 px-4 sm:px-6 mt-auto w-full">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 text-center">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold">
              <a href="#" onClick={showUnderConstruction} className="hover:underline">Contact Us</a>
              <span className="opacity-50 hidden sm:inline">|</span>
              <a href="#" onClick={showUnderConstruction} className="hover:underline">Privacy</a>
              <span className="opacity-50 hidden sm:inline">|</span>
              <a href="#" onClick={showUnderConstruction} className="hover:underline">Security</a>
            </div>
            <p className="text-[11px] sm:text-xs opacity-80 text-center leading-relaxed">
              © ING Bank (Australia) Limited ABN 24 000 893 292. Australian Credit Licence 224000 893 292.
            </p>
          </div>
        </footer>
      </div>
    </AuthWrapper>
  );
}

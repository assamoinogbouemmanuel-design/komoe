"use client";

import { Card, CardContent } from "@/components/ui/Card";
import StatsCard from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { QuoteItemsInput, QuoteItemData } from "@/components/ui/QuoteItemsInput";
import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, PieChart, Receipt, Wallet } from "lucide-react";

export default function BudgetCommune() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItemData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'une requête API vers la blockchain / backend
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      setTimeout(() => {
        setIsDrawerOpen(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la soumission du budget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Gestion du Budget</h2>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Répartition et allocation des fonds pour l'année en cours.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-2xl h-14 px-8 font-black text-base transition-all hover:scale-[1.02] active:scale-95" onClick={() => setIsDrawerOpen(true)}>
          + Nouveau Budget Primitif
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard label="Budget Primitif (2026)" value={500000000} isCurrency icon={<PieChart className="text-primary" />} />
        <StatsCard label="Fonds Engagés" value={125000000} isCurrency trend="up" delta="25%" icon={<Receipt className="text-rose-500" />} />
        <StatsCard label="Reste à Réaliser" value={375000000} isCurrency trend="down" icon={<Wallet className="text-emerald-500" />} />
      </div>

      <Card className="shadow-2xl border-border rounded-[32px] overflow-hidden border bg-card/40 backdrop-blur-xl">
        <CardContent className="p-10">
          <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-widest flex items-center gap-3">
             <span className="w-2 h-6 bg-primary rounded-full"></span>
             Répartition par ligne budgétaire
          </h3>
          <div className="space-y-8">
            <div className="group">
              <div className="flex justify-between text-sm font-black text-foreground mb-3 uppercase tracking-tighter">
                <span className="group-hover:text-primary transition-colors">Infrastructures & Travaux Publics</span>
                <span className="tabular-nums">45%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-3.5 p-0.5 border border-border">
                <div className="bg-primary h-full rounded-full shadow-lg shadow-primary/20 transition-all duration-1000" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="group">
              <div className="flex justify-between text-sm font-black text-foreground mb-3 uppercase tracking-tighter">
                <span className="group-hover:text-amber-500 transition-colors">Santé & Action Sociale</span>
                <span className="tabular-nums">25%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-3.5 p-0.5 border border-border">
                <div className="bg-amber-500 h-full rounded-full shadow-lg shadow-amber-500/20 transition-all duration-1000" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div className="group">
              <div className="flex justify-between text-sm font-black text-foreground mb-3 uppercase tracking-tighter">
                <span className="group-hover:text-emerald-500 transition-colors">Éducation & Culture</span>
                <span className="tabular-nums">20%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-3.5 p-0.5 border border-border">
                <div className="bg-emerald-500 h-full rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-1000" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div className="group">
              <div className="flex justify-between text-sm font-black text-foreground mb-3 uppercase tracking-tighter">
                <span className="group-hover:text-muted-foreground transition-colors">Fonctionnement</span>
                <span className="tabular-nums">10%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-3.5 p-0.5 border border-border mb-3">
                <div className="bg-muted-foreground/30 h-full rounded-full transition-all duration-1000" style={{ width: '10%' }}></div>
              </div>
              <div className="text-right">
                <Link href="/commune/budget/fonctionnement" className="text-[10px] text-primary hover:underline font-black uppercase tracking-widest">Détails des frais de fonctionnement →</Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Voter un Nouveau Budget Primitif">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">Budget Soumis !</h3>
            <p className="text-muted-foreground mt-3 text-center max-w-xs font-medium">Le budget a été scellé en attente de la signature du Maire sur la blockchain.</p>
          </div>
        ) : (
          <form className="space-y-8" onSubmit={handleBudgetSubmit}>
            <div className="space-y-3">
              <label className="text-sm font-black text-foreground uppercase tracking-widest">Lignes Budgétaires (Prévisions)</label>
              <p className="text-xs text-muted-foreground font-medium mb-6 leading-relaxed">Saisissez les montants alloués pour chaque grande ligne. Un hash d'intégrité sera généré à la soumission.</p>
              <QuoteItemsInput onChange={setQuoteItems} />
            </div>

            <div className="pt-8 border-t border-border flex justify-end gap-4">
              <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)} disabled={isSubmitting} className="font-bold rounded-xl h-14 px-8">
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white min-w-[220px] h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                disabled={isSubmitting || quoteItems.length === 0}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Signature...
                  </span>
                ) : "Soumettre le Budget"}
              </Button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
}

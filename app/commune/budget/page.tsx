"use client";

import { Card, CardContent } from "@/components/ui/Card";
import StatsCard from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { QuoteItemsInput, QuoteItemData } from "@/components/ui/QuoteItemsInput";
import { useState } from "react";
import Link from "next/link";

export default function BudgetCommune() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItemData[]>([]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Gestion du Budget</h2>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Répartition et allocation des fonds pour l'année en cours.</p>
        </div>
        <Button className="bg-brand-orange hover:bg-[#b05020] text-white shadow-md" onClick={() => setIsDrawerOpen(true)}>
          + Nouveau Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard label="Budget Primitif (2026)" value={500000000} isCurrency />
        <StatsCard label="Fonds Engagés" value={125000000} isCurrency trend="up" delta="25%" />
        <StatsCard label="Reste à Réaliser" value={375000000} isCurrency trend="down" />
      </div>

      <Card className="shadow-sm border-border rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <h3 className="text-lg font-bold text-foreground mb-6">Répartition par ligne budgétaire</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-foreground mb-2">
                <span>Infrastructures & Travaux Publics</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-4">
                <div className="bg-brand-orange h-4 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-foreground mb-2">
                <span>Santé & Action Sociale</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-4">
                <div className="bg-brand-blue h-4 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-foreground mb-2">
                <span>Éducation & Culture</span>
                <span>20%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-4">
                <div className="bg-emerald-500 h-4 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-foreground mb-2">
                <span>Fonctionnement</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-4 mb-2">
                <div className="bg-muted0 h-4 rounded-full" style={{ width: '10%' }}></div>
              </div>
              <div className="text-right">
                <Link href="/commune/budget/fonctionnement" className="text-xs text-brand-blue hover:underline font-bold">Voir les détails →</Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Voter un Nouveau Budget">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsDrawerOpen(false); }}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Lignes Budgétaires (Prévisions)</label>
            <p className="text-xs text-muted-foreground mb-4">Saisissez les montants alloués pour chaque grande ligne du budget primitif.</p>
            <QuoteItemsInput onChange={setQuoteItems} />
          </div>

          <div className="pt-6 border-t border-border flex justify-end space-x-3">
            <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)}>Annuler</Button>
            <Button type="submit" className="bg-brand-blue hover:bg-[#000060] text-white">Soumettre le Budget</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

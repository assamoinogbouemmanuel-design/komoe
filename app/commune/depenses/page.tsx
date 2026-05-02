"use client";

import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { QuoteItemsInput, QuoteItemData } from "@/components/ui/QuoteItemsInput";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCommuneTransactions } from "@/lib/hooks/useTransactions";
import { type Transaction } from "@/lib/api";

export default function DepensesCommune() {
  const { user } = useAuth();
  const communeId = user?.commune ?? null;
  const { transactions, loading } = useCommuneTransactions(communeId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItemData[]>([]);
  const depenses = transactions.filter(t => t.type === 'DEPENSE');

  const formatXOF = (amount: number) => new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(amount);

  const columns: ColumnConfig<Transaction>[] = [
    {
      header: 'ID Dépense',
      key: 'id',
      render: (val) => <span className="font-mono text-xs text-muted-foreground">{val}</span>
    },
    {
      header: 'Description',
      key: 'description',
      render: (val, item) => (
        <div>
          <div className="font-medium text-foreground">{val}</div>
          <div className="text-xs text-muted-foreground mt-1">Imputé sur: {item.categorie}</div>
        </div>
      )
    },
    {
      header: 'Montant',
      key: 'montant_fcfa',
      render: (val) => <span className="font-bold text-rose-600">-{formatXOF(val)}</span>
    },
    {
      header: 'Date d\'exécution',
      key: 'created_at',
      render: (val) => <span className="text-muted-foreground">{new Date(val).toLocaleDateString()}</span>
    },
    {
      header: 'Statut',
      key: 'statut',
      render: (val) => <Badge variant={val === 'VALIDE' ? 'destructive' : 'secondary'}>{val === 'VALIDE' ? 'Payé' : 'En attente'}</Badge>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, item) => (
        <Link href={`/commune/depenses/${item.id}`}>
          <Button variant="ghost" size="sm">Détails</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Registre des Dépenses</h2>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Suivi détaillé des décaissements effectués par la commune.</p>
        </div>
        <Button className="bg-brand-orange hover:bg-[#b05020] text-white shadow-md" onClick={() => setIsDrawerOpen(true)}>
          + Ajouter Dépense
        </Button>
      </div>

      <DataTable 
        title="Dépenses Enregistrées"
        columns={columns}
        data={depenses}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Ajouter une nouvelle dépense">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsDrawerOpen(false); }}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Détails de la facture / dépense</label>
            <QuoteItemsInput onChange={setQuoteItems} />
          </div>

          <div className="pt-6 border-t border-border flex justify-end space-x-3">
            <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)}>Annuler</Button>
            <Button type="submit" className="bg-brand-blue hover:bg-[#000060] text-white">Soumettre la dépense</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

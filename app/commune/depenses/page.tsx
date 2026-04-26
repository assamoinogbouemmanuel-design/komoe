"use client";

import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { QuoteItemsInput, QuoteItemData } from "@/components/ui/QuoteItemsInput";
import { useState } from "react";
import Link from "next/link";
import transactionsData from "@/mock/transactions.json";

export default function DepensesCommune() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItemData[]>([]);
  // On ne filtre que les dépenses pour cette page
  const depenses = transactionsData.filter(t => t.communeId === 'COM-001' && t.type === 'DEPENSE');

  const formatXOF = (amount: number) => new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(amount);

  const columns: ColumnConfig<any>[] = [
    {
      header: 'ID Dépense',
      key: 'id',
      render: (val) => <span className="font-mono text-xs text-slate-500">{val}</span>
    },
    {
      header: 'Description',
      key: 'description',
      render: (val, item) => (
        <div>
          <div className="font-medium text-slate-900">{val}</div>
          <div className="text-xs text-slate-500 mt-1">Imputé sur: {item.categorie}</div>
        </div>
      )
    },
    {
      header: 'Montant',
      key: 'montant',
      render: (val) => <span className="font-bold text-rose-600">-{formatXOF(val)}</span>
    },
    {
      header: 'Date d\'exécution',
      key: 'date',
      render: (val) => <span className="text-slate-600">{new Date(val).toLocaleDateString()}</span>
    },
    {
      header: 'Statut',
      key: 'status',
      render: () => <Badge variant="destructive">Payé</Badge>
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Registre des Dépenses</h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">Suivi détaillé des décaissements effectués par la commune.</p>
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
            <label className="text-sm font-bold text-slate-700">Détails de la facture / dépense</label>
            <QuoteItemsInput onChange={setQuoteItems} />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
            <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)}>Annuler</Button>
            <Button type="submit" className="bg-brand-blue hover:bg-[#000060] text-white">Soumettre la dépense</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

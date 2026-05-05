"use client";

import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCommuneTransactions } from "@/lib/hooks/useTransactions";
import { type Transaction } from "@/lib/api";
import { DepenseForm } from "@/components/agent/DepenseForm";
import StatsCard from "@/components/ui/StatsCard";
import { Receipt, Wallet, ArrowDownRight } from "lucide-react";

export default function DepensesCommune() {
  const { user } = useAuth();
  const communeId = user?.commune ?? null;
  const { transactions, loading, refetch } = useCommuneTransactions(communeId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const depenses = transactions.filter(t => t.type === 'DEPENSE');
  const totalDepense = depenses.reduce((acc, t) => acc + t.montant_fcfa, 0);

  const formatXOF = (amount: number) => new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(amount);

  const columns: ColumnConfig<Transaction>[] = [
    {
      header: 'ID Dépense',
      key: 'id',
      render: (val) => <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-tighter">{val.slice(0, 8)}...</span>
    },
    {
      header: 'Description',
      key: 'description',
      render: (val, item) => (
        <div>
          <div className="font-black text-foreground line-clamp-1">{val}</div>
          <div className="text-[10px] font-bold text-primary mt-1 uppercase tracking-widest bg-primary/5 w-fit px-2 py-0.5 rounded-md border border-primary/10">{item.categorie}</div>
        </div>
      )
    },
    {
      header: 'Montant',
      key: 'montant_fcfa',
      render: (val) => <span className="font-black text-rose-600 tabular-nums">-{formatXOF(val)}</span>
    },
    {
      header: 'Exécution',
      key: 'created_at',
      render: (val) => <span className="text-muted-foreground font-medium text-sm">{new Date(val).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
    },
    {
      header: 'Statut',
      key: 'statut',
      render: (val) => (
        <Badge variant={val === 'VALIDE' ? 'success' : 'secondary'} className="rounded-full px-3 font-bold">
          {val === 'VALIDE' ? 'SCELLÉ' : 'À SIGNER'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, item) => (
        <Link href={`/commune/transactions/${item.id}`}>
          <Button variant="ghost" size="sm" className="font-bold hover:text-primary rounded-xl">Détails</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-card border border-border p-8 rounded-[32px] shadow-2xl shadow-primary/5">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Registre des Dépenses</h2>
          <p className="text-muted-foreground mt-2 font-medium text-sm max-w-xl">Suivi immuable des décaissements. Toutes les pièces justificatives sont scellées sur Polygon.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-2xl h-14 px-8 font-black text-base transition-all hover:scale-[1.02] active:scale-95 shrink-0" onClick={() => setIsDrawerOpen(true)}>
          + Nouvelle Dépense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard label="Dépenses Enregistrées" value={depenses.length} icon={<Receipt className="text-primary" />} />
        <StatsCard label="Total Décaissements" value={totalDepense} isCurrency icon={<ArrowDownRight className="text-rose-500" />} />
        <StatsCard label="Budget Consommé" value="42%" icon={<Wallet className="text-amber-500" />} />
      </div>

      <DataTable 
        title="Dépenses Enregistrées"
        columns={columns}
        data={depenses}
        loading={loading}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Ajouter une nouvelle dépense">
        <div className="py-4">
          <DepenseForm 
            onSuccess={() => {
              setIsDrawerOpen(false);
              refetch();
            }} 
            onCancel={() => setIsDrawerOpen(false)}
          />
        </div>
      </Drawer>
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/Card";
import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";

export default function EmissionsFinance() {
  const emissions = [
    { id: 'EM-001', montant: 50000000000, actif: "e-CFA", date: "2026-01-10", hash: "0x12a...", statut: "Confirmé" },
    { id: 'EM-002', montant: 25000000000, actif: "e-CFA", date: "2026-03-15", hash: "0x4fb...", statut: "Confirmé" },
  ];

  const columns: ColumnConfig<any>[] = [
    { header: 'ID Émission', key: 'id', render: (val) => <span className="font-mono text-xs">{val}</span> },
    { header: 'Actif Numérique', key: 'actif', render: (val) => <span className="font-bold text-brand-blue">{val}</span> },
    { header: 'Volume Émis', key: 'montant', render: (val) => <span className="font-black text-slate-900">{val.toLocaleString()}</span> },
    { header: 'Date', key: 'date', render: (val) => <span className="text-slate-600">{new Date(val).toLocaleDateString()}</span> },
    { header: 'Preuve (Hash)', key: 'hash', render: (val) => <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">{val}</span> },
    { header: 'Statut', key: 'statut', render: () => <Badge variant="success">Confirmé</Badge> }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Historique des Émissions</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Registre central des créations de monnaie numérique de banque centrale (MNBC).</p>
      </div>
      <DataTable title="Émissions e-CFA" columns={columns} data={emissions} />
    </div>
  );
}

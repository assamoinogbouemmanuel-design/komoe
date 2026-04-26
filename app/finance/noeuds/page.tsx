"use client";

import { Card, CardContent } from "@/components/ui/Card";
import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Server } from "lucide-react";

export default function NoeudsFinance() {
  const noeuds = [
    { id: 'N-01', institution: "BCEAO Principale", type: "Nœud Racine", localisation: "Dakar, SN", uptime: "99.99%" },
    { id: 'N-02', institution: "Trésor Public CI", type: "Validateur", localisation: "Abidjan, CI", uptime: "99.95%" },
    { id: 'N-03', institution: "Banque Mondiale", type: "Observateur", localisation: "Washington, US", uptime: "99.98%" },
  ];

  const columns: ColumnConfig<any>[] = [
    { header: 'Institution', key: 'institution', render: (val) => <span className="font-bold text-slate-900 flex items-center gap-2"><Server size={16} className="text-brand-blue" />{val}</span> },
    { header: 'Rôle Réseau', key: 'type', render: (val) => <Badge variant={val === 'Nœud Racine' ? 'destructive' : 'secondary'}>{val}</Badge> },
    { header: 'Localisation', key: 'localisation' },
    { header: 'Disponibilité (Uptime)', key: 'uptime', render: (val) => <span className="font-mono text-emerald-600 font-bold">{val}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gestion des Nœuds Validateurs</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Administration des entités autorisées à valider les blocs sur le réseau privé/consortium.</p>
      </div>
      <DataTable title="Nœuds Actifs" columns={columns} data={noeuds} />
    </div>
  );
}

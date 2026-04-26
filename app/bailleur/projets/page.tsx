"use client";

import { Card, CardContent } from "@/components/ui/Card";
import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "lucide-react";

export default function ProjetsBailleur() {
  const projets = [
    { id: 'PRJ-01', nom: "Construction Hôpital Cocody", commune: "Cocody", budget: 500000000, statut: "En cours", taux: 45 },
    { id: 'PRJ-02', nom: "Forage Eau Potable", commune: "Bouaké", budget: 120000000, statut: "Achevé", taux: 100 },
    { id: 'PRJ-03', nom: "Rénovation École Primaire", commune: "Abobo", budget: 85000000, statut: "En attente", taux: 0 },
  ];

  const columns: ColumnConfig<any>[] = [
    { header: 'Projet', key: 'nom', render: (val) => <span className="font-bold text-slate-900">{val}</span> },
    { header: 'Commune', key: 'commune' },
    { header: 'Budget Alloué', key: 'budget', render: (val) => <span className="font-mono text-brand-orange">{val.toLocaleString()} FCFA</span> },
    { header: 'Statut', key: 'statut', render: (val) => <Badge variant={val === 'Achevé' ? 'success' : val === 'En cours' ? 'default' : 'secondary'}>{val}</Badge> },
    { header: 'Exécution', key: 'taux', render: (val) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-slate-100 rounded-full"><div className="h-full bg-brand-blue rounded-full" style={{ width: `${val}%` }}></div></div>
        <span className="text-xs font-bold text-slate-500">{val}%</span>
      </div>
    )}
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Projets Financés</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Suivi des infrastructures et projets parrainés.</p>
      </div>
      <DataTable title="Liste des Projets" columns={columns} data={projets} />
    </div>
  );
}

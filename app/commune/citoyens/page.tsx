"use client";

import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function CitoyensCommune() {
  const citoyens = [
    { id: 1, nom: "Kouadio Jean", email: "jean.k@email.ci", telephone: "+225 0700112233", quartier: "Riviera 2", statut: "Vérifié" },
    { id: 2, nom: "Bamba Awa", email: "awa.b@email.ci", telephone: "+225 0500445566", quartier: "Angré", statut: "En attente" },
    { id: 3, nom: "Touré Ibrahim", email: "ibou.t@email.ci", telephone: "+225 0100778899", quartier: "Cocody Centre", statut: "Vérifié" },
    { id: 4, nom: "Yao Marie", email: "marie.yao@email.ci", telephone: "+225 0700998877", quartier: "Blockhauss", statut: "Vérifié" },
  ];

  const columns: ColumnConfig<any>[] = [
    { header: 'Nom Complet', key: 'nom' },
    { header: 'Email', key: 'email' },
    { header: 'Téléphone', key: 'telephone' },
    { header: 'Quartier', key: 'quartier' },
    {
      header: 'Statut KYC',
      key: 'statut',
      render: (val) => <Badge variant={val === 'Vérifié' ? 'success' : 'secondary'}>{val}</Badge>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, item) => (
        <Link href={`/commune/citoyens/${item.id}`}>
          <Button variant="ghost" size="sm">Détails</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Registre des Citoyens</h2>
        <p className="text-muted-foreground mt-1 font-medium text-sm">Gestion des habitants inscrits et vérifiés sur la plateforme.</p>
      </div>

      <DataTable 
        title="Liste des Citoyens"
        columns={columns}
        data={citoyens}
      />
    </div>
  );
}

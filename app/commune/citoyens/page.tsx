"use client";

import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Users, UserCheck, MapPin, Activity } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";

export default function CitoyensCommune() {
  const citoyens = [
    { id: 1, nom: "Kouadio Jean", email: "jean.k@email.ci", telephone: "+225 0700112233", quartier: "Riviera 2", statut: "Vérifié", avatar: "JK" },
    { id: 2, nom: "Bamba Awa", email: "awa.b@email.ci", telephone: "+225 0500445566", quartier: "Angré", statut: "En attente", avatar: "AB" },
    { id: 3, nom: "Touré Ibrahim", email: "ibou.t@email.ci", telephone: "+225 0100778899", quartier: "Cocody Centre", statut: "Vérifié", avatar: "IT" },
    { id: 4, nom: "Yao Marie", email: "marie.yao@email.ci", telephone: "+225 0700998877", quartier: "Blockhauss", statut: "Vérifié", avatar: "MY" },
    { id: 5, nom: "Diakité Moussa", email: "moussa.d@email.ci", telephone: "+225 0701223344", quartier: "Plateau Dokui", statut: "Vérifié", avatar: "MD" },
  ];

  const columns: ColumnConfig<any>[] = [
    { 
      header: 'Citoyen', 
      key: 'nom',
      render: (val, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs border border-primary/20">
            {item.avatar}
          </div>
          <div>
            <div className="font-black text-foreground">{val}</div>
            <div className="text-[10px] text-muted-foreground font-bold truncate max-w-[150px]">{item.email}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Localisation', 
      key: 'quartier',
      render: (val) => (
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-muted-foreground" />
          <span className="text-sm font-medium">{val}</span>
        </div>
      )
    },
    { 
      header: 'Téléphone', 
      key: 'telephone',
      render: (val) => <span className="text-xs font-mono font-bold text-muted-foreground">{val}</span>
    },
    {
      header: 'Statut KYC',
      key: 'statut',
      render: (val) => (
        <Badge variant={val === 'Vérifié' ? 'success' : 'secondary'} className="rounded-full px-3 font-bold">
          {val.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, item) => (
        <Link href={`/commune/citoyens/${item.id}`}>
          <Button variant="ghost" size="sm" className="font-bold hover:text-primary rounded-xl">Consulter</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-card border border-border p-8 rounded-[32px] shadow-2xl shadow-primary/5">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Registre des Citoyens</h2>
          <p className="text-muted-foreground mt-2 font-medium text-sm">Gestion et vérification de l'identité des habitants de la commune.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-2xl h-14 px-8 font-black text-base transition-all hover:scale-[1.02] active:scale-95">
          Inscrire un citoyen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard label="Citoyens Inscrits" value={citoyens.length} icon={<Users className="text-primary" />} />
        <StatsCard label="Identités Vérifiées" value={4} icon={<UserCheck className="text-emerald-500" />} />
        <StatsCard label="Taux de Pénétration" value="68%" icon={<Activity className="text-blue-500" />} />
      </div>

      <DataTable 
        title="Base de données citoyenne"
        columns={columns}
        data={citoyens}
      />
    </div>
  );
}

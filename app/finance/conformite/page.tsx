"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import institutionsData from "@/mock/institutions.json";

export default function ConformiteFinance() {
  const inst = institutionsData[0];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Conformité & Sécurité</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">État du réseau des nœuds et intégrité des données.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard label="Score global de conformité" value={`${inst.scoreConformite}/100`} trend="up" delta="+2pts" />
        <StatsCard label="Nœuds Actifs" value={142} />
      </div>

      <Card className="shadow-sm border-emerald-100 bg-emerald-50/30 rounded-3xl">
        <CardContent className="p-6 flex items-start space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Intégrité Cryptographique Validée</h3>
            <p className="text-sm text-emerald-700 mt-1">Tous les hashs locaux correspondent aux enregistrements on-chain. Aucune anomalie détectée lors du dernier audit automatique.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-amber-100 bg-amber-50/30 rounded-3xl mt-6">
        <CardContent className="p-6 flex items-start space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">Alerte Mineure de Latence</h3>
            <p className="text-sm text-amber-700 mt-1">Latence moyenne de validation des blocs sur le testnet Sepolia légèrement élevée (14.2s au lieu de 12s).</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import communesData from "@/mock/communes.json";
import StatsCard from "@/components/ui/StatsCard";

export default function CommunesSoutenues() {
  const bailleurCommunes = communesData.filter(c => ["COM-001", "COM-003"].includes(c.id));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Communes Soutenues</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Vue détaillée de l'exécution budgétaire des communes que vous financez.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bailleurCommunes.map(commune => {
          const taux = ((commune.budgetDepense / commune.budgetAlloue) * 100).toFixed(1);
          return (
            <Card key={commune.id} className="shadow-sm border-slate-100 rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-slate-900">{commune.nom}</CardTitle>
                    <p className="text-xs text-slate-500 mt-1">{commune.region} • {commune.district}</p>
                  </div>
                  <Badge variant="success">Actif</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <StatsCard label="Budget Alloué" value={commune.budgetAlloue} isCurrency />
                  <StatsCard label="Budget Dépensé" value={commune.budgetDepense} isCurrency trend="down" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Taux d'exécution</span>
                    <span>{taux}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-brand-blue h-3 rounded-full" style={{ width: `${taux}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

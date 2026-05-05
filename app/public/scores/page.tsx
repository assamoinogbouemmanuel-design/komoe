"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import StatsCard from "@/components/ui/StatsCard";
import { BarChart3, TrendingUp, TrendingDown, Loader2, Globe, Building2, ShieldCheck, AlertCircle } from "lucide-react";
import { useCommunesList } from "@/lib/hooks/useCommunes";

export default function ScoresPage() {
  const { communes: rawCommunes, loading } = useCommunesList();
  const communes = [...rawCommunes].sort((a, b) => b.score_transparence - a.score_transparence);
  const avg = communes.length > 0 ? Math.round(communes.reduce((s, c) => s + c.score_transparence, 0) / communes.length) : 0;
  const top = communes.filter((c) => c.score_transparence >= 70);
  const mid = communes.filter((c) => c.score_transparence >= 50 && c.score_transparence < 70);
  const low = communes.filter((c) => c.score_transparence < 50);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card border border-border p-8 rounded-[32px] shadow-2xl shadow-primary/5">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic flex items-center gap-3">
             <BarChart3 className="text-primary" /> Indice de Transparence
          </h2>
          <p className="text-muted-foreground mt-2 font-medium max-w-2xl">
             Classement national basé sur l'intégrité des données blockchain, la ponctualité des rapports et la satisfaction citoyenne.
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 py-2 px-4 rounded-xl flex items-center gap-2">
           <Globe size={16} /> Mis à jour en temps réel
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Moyenne Nationale" value={avg} icon={<BarChart3 className="text-primary" />} />
        <StatsCard label="Communes Élite" value={top.length} icon={<ShieldCheck className="text-emerald-500" />} />
        <StatsCard label="Besoin de Support" value={low.length} icon={<AlertCircle className="text-rose-500" />} />
        <StatsCard label="Communes Actives" value={communes.length} icon={<Building2 className="text-blue-500" />} />
      </div>

      <Card className="shadow-2xl border-border rounded-[32px] overflow-hidden border bg-card/40 backdrop-blur-xl">
        <CardHeader className="p-8 border-b border-border bg-muted/30">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-foreground flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            Classement Global des Collectivités
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-4">
              {loading && <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-xs font-black uppercase tracking-widest">Calcul des indices...</span>
              </div>}
          {!loading && communes.map((c, i) => (
            <div key={c.id} className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-muted/50 transition-all border border-transparent hover:border-border">
              <span className="w-8 text-sm font-black text-muted-foreground text-center shrink-0 tabular-nums">
                {i < 3 ? (
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? "bg-amber-400 text-amber-900" : i === 1 ? "bg-slate-300 text-slate-800" : "bg-amber-700 text-white"}`}>
                    {i + 1}
                  </span>
                ) : i + 1}
              </span>
              <div className="w-48 shrink-0">
                <p className="font-black text-foreground group-hover:text-primary transition-colors">{c.nom}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{c.region}</p>
              </div>
              <div className="flex-1 bg-muted/50 rounded-full h-3 p-0.5 border border-border">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${c.score_transparence >= 70 ? "bg-emerald-500" : c.score_transparence >= 50 ? "bg-amber-400" : "bg-rose-500"}`}
                  style={{ width: `${c.score_transparence}%` }}
                />
              </div>
              <div className="flex items-center gap-4 w-32 justify-end shrink-0">
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1.5 font-black text-lg">
                      {c.score_transparence}
                      <span className="text-[10px] text-muted-foreground opacity-50">/100</span>
                   </div>
                   <div className="flex items-center gap-1 mt-0.5">
                      {c.score_transparence >= 70 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                      <span className={`text-[9px] font-black uppercase tracking-tighter ${c.score_transparence >= 70 ? "text-emerald-500" : "text-rose-500"}`}>
                        {c.score_transparence >= 70 ? "Stable" : "En baisse"}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

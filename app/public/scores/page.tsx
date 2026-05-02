"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BarChart3, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useCommunesList } from "@/lib/hooks/useCommunes";

export default function ScoresPage() {
  const { communes: rawCommunes, loading } = useCommunesList();
  const communes = [...rawCommunes].sort((a, b) => b.score_transparence - a.score_transparence);
  const avg = communes.length > 0 ? Math.round(communes.reduce((s, c) => s + c.score_transparence, 0) / communes.length) : 0;
  const top = communes.filter((c) => c.score_transparence >= 70);
  const mid = communes.filter((c) => c.score_transparence >= 50 && c.score_transparence < 70);
  const low = communes.filter((c) => c.score_transparence < 50);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Score de transparence</h2>
        <p className="text-muted-foreground mt-1 text-sm">Indice calculé sur la régularité des dépôts blockchain et la validation des transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Score moyen national", value: `${avg}/100`, color: "text-foreground" },
          { label: "Excellents (≥ 70)", value: top.length, color: "text-emerald-600" },
          { label: "Moyens (50–69)", value: mid.length, color: "text-amber-600" },
          { label: "Faibles (< 50)", value: low.length, color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-5">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Toutes les communes — Score de transparence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
              {loading && <div className="flex justify-center py-8 text-muted-foreground gap-2"><Loader2 className="w-4 h-4 animate-spin" />Chargement…</div>}
          {!loading && communes.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 py-2">
              <span className="w-6 text-xs text-muted-foreground text-right shrink-0">{i + 1}</span>
              <span className="w-28 text-sm font-medium text-foreground truncate shrink-0">{c.nom}</span>
              <div className="flex-1 bg-muted/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${c.score_transparence >= 70 ? "bg-emerald-500" : c.score_transparence >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${c.score_transparence}%` }}
                />
              </div>
              <div className="flex items-center gap-1 w-20 justify-end shrink-0">
                {c.score_transparence >= 70 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
                <Badge variant={c.score_transparence >= 70 ? "success" : c.score_transparence >= 50 ? "secondary" : "destructive"}>
                  {c.score_transparence}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

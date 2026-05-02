"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BarChart3, Loader2 } from "lucide-react";
import { useCommunesList } from "@/lib/hooks/useCommunes";
import { formatFCFA } from "@/lib/constants";

export default function ComparatifPage() {
  const { communes: rawCommunes, loading } = useCommunesList();
  const communes = [...rawCommunes].sort((a, b) => b.score_transparence - a.score_transparence);
  const avg = communes.length > 0 ? Math.round(communes.reduce((s, c) => s + c.score_transparence, 0) / communes.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Comparatif communes</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Score de transparence · taux d&apos;exécution budgétaire · données open data
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Score national moyen</p>
          <p className="text-2xl font-bold text-foreground">{avg}/100</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Meilleur score</p>
          <p className="text-2xl font-bold text-emerald-600">{communes[0]?.score_transparence ?? '…'}/100</p>
          <p className="text-xs text-muted-foreground">{communes[0]?.nom}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Score le plus bas</p>
          <p className="text-2xl font-bold text-red-600">{communes[communes.length - 1]?.score_transparence ?? '…'}/100</p>
          <p className="text-xs text-muted-foreground">{communes[communes.length - 1]?.nom}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Comparatif — Score · Budget · Exécution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Commune</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Budget alloué</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Budget dépensé</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exécution</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Chargement…</td></tr>}
                {!loading && communes.map((c, i) => {
                  const execRate = c.budget_annuel_fcfa > 0
                    ? ((c.budget_depense_fcfa / c.budget_annuel_fcfa) * 100).toFixed(0)
                    : '0';
                  return (
                    <tr key={c.id} className="hover:bg-muted transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 text-xs text-muted-foreground text-right shrink-0">{i + 1}</span>
                          <div>
                            <p className="font-semibold text-foreground">{c.nom}</p>
                            <p className="text-xs text-muted-foreground">{c.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">{formatFCFA(c.budget_annuel_fcfa)}</td>
                      <td className="px-4 py-3 text-right text-foreground hidden md:table-cell">{formatFCFA(c.budget_depense_fcfa)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 bg-muted/50 rounded-full h-1.5 hidden sm:block">
                            <div
                              className="h-1.5 rounded-full bg-[#cd6133]"
                              style={{ width: `${Math.min(Number(execRate), 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-foreground">{execRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant={c.score_transparence >= 70 ? "success" : c.score_transparence >= 50 ? "secondary" : "destructive"}>
                          {c.score_transparence}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

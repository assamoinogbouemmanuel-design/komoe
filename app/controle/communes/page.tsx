"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, Globe, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useCommunesList } from "@/lib/hooks/useCommunes";
import { formatFCFA } from "@/lib/constants";

const scoreVariant = (s: number) =>
  s >= 70 ? "success" : s >= 50 ? "secondary" : "destructive";

const scoreTrend = (s: number) =>
  s >= 70 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> :
  s >= 50 ? <Minus className="w-4 h-4 text-amber-500" /> :
            <TrendingDown className="w-4 h-4 text-red-500" />;

export default function CommunesPage() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("Tous");
  const { communes: allCommunes, loading } = useCommunesList();

  const regions = ["Tous", ...Array.from(new Set(allCommunes.map((c) => c.region)))];

  const filtered = allCommunes.filter((c) => {
    const matchSearch = c.nom.toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === "Tous" || c.region === regionFilter;
    return matchSearch && matchRegion;
  });

  const totalBudget = allCommunes.reduce((s, c) => s + c.budget_annuel_fcfa, 0);
  const totalDepense = allCommunes.reduce((s, c) => s + c.budget_depense_fcfa, 0);
  const avgScore = allCommunes.length > 0
    ? Math.round(allCommunes.reduce((s, c) => s + c.score_transparence, 0) / allCommunes.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Les 201 communes</h2>
        <p className="text-muted-foreground mt-1 text-sm">Vue nationale — {allCommunes.length} communes actives de Côte d&apos;Ivoire</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Budget national alloué</p>
            <p className="text-xl font-bold text-foreground">{loading ? '…' : formatFCFA(totalBudget)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Dépenses consolidées</p>
            <p className="text-xl font-bold text-foreground">{loading ? '…' : formatFCFA(totalDepense)}</p>
            <p className="text-xs text-muted-foreground mt-1">{totalBudget > 0 ? ((totalDepense / totalBudget) * 100).toFixed(1) : 0}% exécuté</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Score moy. transparence</p>
            <p className="text-xl font-bold text-foreground">{loading ? '…' : `${avgScore}/100`}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une commune ou un district…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000040]"
              />
            </div>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000040] bg-card"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-blue-600" />
            {filtered.length} commune{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Commune</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Région</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Budget alloué</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Dépensé</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">Chargement…</td></tr>
                )}
                {!loading && filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{c.nom}</p>
                      <p className="text-xs text-muted-foreground">{c.region}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{c.region}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{formatFCFA(c.budget_annuel_fcfa)}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className="text-foreground">{formatFCFA(c.budget_depense_fcfa)}</span>
                      <div className="w-16 bg-muted/50 rounded-full h-1 mt-1 ml-auto">
                        <div
                          className="h-1 rounded-full bg-[#cd6133]"
                          style={{ width: `${Math.min(c.budget_annuel_fcfa > 0 ? (c.budget_depense_fcfa / c.budget_annuel_fcfa) * 100 : 0, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {scoreTrend(c.score_transparence)}
                        <Badge variant={scoreVariant(c.score_transparence)}>
                          {c.score_transparence}/100
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

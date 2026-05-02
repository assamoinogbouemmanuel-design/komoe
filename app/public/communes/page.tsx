"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Globe, Search, Loader2 } from "lucide-react";
import { useCommunesList } from "@/lib/hooks/useCommunes";
import { formatFCFA } from "@/lib/constants";

export default function PublicCommunesPage() {
  const [search, setSearch] = useState("");
  const { communes: allCommunes, loading } = useCommunesList();
  const filtered = allCommunes.filter((c) =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Communes</h2>
        <p className="text-muted-foreground mt-1 text-sm">Données ouvertes — {allCommunes.length} communes de Côte d&apos;Ivoire</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une commune…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000040]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            {filtered.length} commune{filtered.length > 1 ? "s" : ""}
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
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Taux exec.</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Chargement…</td></tr>}
                {!loading && filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted transition">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{c.nom}</p>
                      <p className="text-xs text-muted-foreground">{c.region}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{c.region}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatFCFA(c.budget_annuel_fcfa)}</td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {c.budget_annuel_fcfa > 0 ? ((c.budget_depense_fcfa / c.budget_annuel_fcfa) * 100).toFixed(0) : 0}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant={c.score_transparence >= 70 ? "success" : c.score_transparence >= 50 ? "secondary" : "destructive"}>
                        {c.score_transparence}/100
                      </Badge>
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

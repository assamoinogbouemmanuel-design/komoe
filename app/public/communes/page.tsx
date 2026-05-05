"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Globe, Search, Loader2, MapPin } from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card border border-border p-8 rounded-[32px] shadow-2xl shadow-primary/5">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic flex items-center gap-3">
             <Globe className="text-primary" /> Répertoire National
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
             Consultez les indicateurs de performance des {allCommunes.length} communes de Côte d&apos;Ivoire.
          </p>
        </div>
      </div>

      <Card className="shadow-lg border-border rounded-[24px] overflow-hidden">
        <CardContent className="p-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher une commune ou une région..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-sm font-bold bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl border-border rounded-[32px] overflow-hidden border">
        <CardHeader className="bg-muted/30 border-b border-border p-8">
          <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            Collectivités Territoriales ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Commune</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden sm:table-cell">Région</th>
                  <th className="text-right px-4 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Budget</th>
                  <th className="text-right px-4 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Exécution</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Chargement de la base...</span>
                       </div>
                    </td>
                  </tr>
                )}
                {!loading && filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-all group">
                    <td className="px-8 py-4">
                      <p className="font-black text-foreground group-hover:text-primary transition-colors">{c.nom}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter sm:hidden">{c.region}</p>
                    </td>
                    <td className="px-4 py-4 text-xs font-bold text-muted-foreground hidden sm:table-cell uppercase tracking-widest">{c.region}</td>
                    <td className="px-4 py-4 text-right font-bold text-foreground tabular-nums">{formatFCFA(c.budget_annuel_fcfa)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                           <div 
                             className="h-full bg-primary" 
                             style={{ width: `${c.budget_annuel_fcfa > 0 ? (c.budget_depense_fcfa / c.budget_annuel_fcfa) * 100 : 0}%` }} 
                           />
                        </div>
                        <span className="text-xs font-black text-foreground tabular-nums">
                          {c.budget_annuel_fcfa > 0 ? ((c.budget_depense_fcfa / c.budget_annuel_fcfa) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <Badge variant={c.score_transparence >= 70 ? "success" : c.score_transparence >= 50 ? "secondary" : "destructive"} className="rounded-lg px-3 font-black">
                        {c.score_transparence}
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

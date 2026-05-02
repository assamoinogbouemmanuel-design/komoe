"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, Download, Calendar, CheckCircle } from "lucide-react";
import { formatFCFA } from "@/lib/constants";
import { useCommunesList } from "@/lib/hooks/useCommunes";

const RAPPORTS = [
  { id: "R1", titre: "Rapport de transparence T1 2026 — National", type: "Trimestriel", date: "2026-04-01", statut: "Publié" },
  { id: "R2", titre: "Rapport sectoriel — Infrastructures & ODD 9", type: "Sectoriel", date: "2026-03-20", statut: "Publié" },
  { id: "R3", titre: "Audit blockchain — Intégrité Polygon Amoy", type: "Audit", date: "2026-03-01", statut: "Publié" },
  { id: "R4", titre: "Rapport budget 2025 — Exécution finale", type: "Annuel", date: "2026-01-15", statut: "Publié" },
  { id: "R5", titre: "Rapport d'activité KOMOE — Bilan Phase 1", type: "Interne", date: "2026-02-01", statut: "Archivé" },
];

const TYPE_COLORS: Record<string, "success" | "secondary" | "outline" | "destructive"> = {
  Trimestriel: "success", Sectoriel: "secondary", Audit: "outline",
  Annuel: "success", Interne: "outline",
};

export default function RapportsPublicsPage() {
  const { communes } = useCommunesList();
  const totalBudget = communes.reduce((s, c) => s + c.budget_annuel_fcfa, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Rapports & Audits</h2>
        <p className="text-muted-foreground mt-1 text-sm">Documents officiels — librement accessibles en données ouvertes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Budget national consolidé</p>
          <p className="text-xl font-bold text-foreground">{formatFCFA(totalBudget)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Rapports publiés</p>
          <p className="text-2xl font-bold text-emerald-600">{RAPPORTS.filter(r => r.statut === "Publié").length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Communes couvertes</p>
          <p className="text-2xl font-bold text-foreground">{communes.length}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-foreground" />
            Documents publics disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {RAPPORTS.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted transition">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#000040]/10 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{r.titre}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant={TYPE_COLORS[r.type] ?? "outline"}>{r.type}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />{r.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <Badge variant={r.statut === "Publié" ? "success" : "outline"}>
                  {r.statut === "Publié" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {r.statut}
                </Badge>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition" title="Télécharger">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

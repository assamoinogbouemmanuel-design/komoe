"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, Download, Calendar, CheckCircle } from "lucide-react";
import { formatFCFA } from "@/lib/constants";
import { useCommunesList } from "@/lib/hooks/useCommunes";
import { useTransactionsList } from "@/lib/hooks/useTransactions";

const RAPPORTS = [
  {
    id: "RAP-001",
    titre: "Rapport national de transparence budgétaire — T1 2026",
    type: "Trimestriel",
    date: "2026-04-01",
    statut: "Publié",
    communes: 201,
    montant: 185_000_000_000,
  },
  {
    id: "RAP-002",
    titre: "Rapport d'exécution budgétaire — Abidjan District",
    type: "Régional",
    date: "2026-03-15",
    statut: "Publié",
    communes: 13,
    montant: 98_000_000_000,
  },
  {
    id: "RAP-003",
    titre: "Audit blockchain — Intégrité des données Polygon Amoy",
    type: "Audit",
    date: "2026-03-01",
    statut: "Publié",
    communes: 201,
    montant: null,
  },
  {
    id: "RAP-004",
    titre: "Rapport spécial — Communes à faible transparence",
    type: "Alerte",
    date: "2026-02-20",
    statut: "Archivé",
    communes: 12,
    montant: 24_000_000_000,
  },
  {
    id: "RAP-005",
    titre: "Rapport national de transparence budgétaire — T4 2025",
    type: "Trimestriel",
    date: "2026-01-15",
    statut: "Archivé",
    communes: 201,
    montant: 172_000_000_000,
  },
];

const TYPE_COLORS: Record<string, "success" | "secondary" | "outline" | "destructive"> = {
  Trimestriel: "success",
  Régional: "secondary",
  Audit: "outline",
  Alerte: "destructive",
};

export default function RapportsPage() {
  const { communes } = useCommunesList();
  const { transactions } = useTransactionsList();
  const totalBudget = communes.reduce((s, c) => s + c.budget_annuel_fcfa, 0);
  const totalDepense = communes.reduce((s, c) => s + c.budget_depense_fcfa, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Rapports officiels</h2>
          <p className="text-muted-foreground mt-1 text-sm">Rapports DGDDL · Audits · Exports nationaux</p>
        </div>
        <button className="flex items-center gap-2 bg-[#000040] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#000060] transition">
          + Générer un rapport
        </button>
      </div>

      {/* Chiffres clés du dernier rapport */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Communes couvertes", value: "201" },
          { label: "Budget national alloué", value: formatFCFA(totalBudget) },
          { label: "Taux d'exécution", value: totalBudget > 0 ? `${((totalDepense / totalBudget) * 100).toFixed(1)}%` : "—" },
          { label: "Transactions vérifiées", value: transactions.length.toString() },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-lg font-bold text-foreground truncate">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Liste des rapports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-foreground" />
            Tous les rapports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {RAPPORTS.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#000040]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{r.titre}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant={TYPE_COLORS[r.type] ?? "outline"}>{r.type}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {r.date}
                    </span>
                    <span className="text-xs text-muted-foreground">{r.communes} commune{r.communes > 1 ? "s" : ""}</span>
                    {r.montant && (
                      <span className="text-xs text-muted-foreground">{formatFCFA(r.montant)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <Badge variant={r.statut === "Publié" ? "success" : "outline"}>
                  {r.statut === "Publié" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {r.statut}
                </Badge>
                <button
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition"
                  title="Télécharger"
                >
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

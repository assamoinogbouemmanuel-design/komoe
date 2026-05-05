"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, Download, Calendar, CheckCircle, Loader2, Plus, Filter, Search, BarChart3 } from "lucide-react";
import { formatFCFA } from "@/lib/constants";
import { useCommunesList } from "@/lib/hooks/useCommunes";
import { useTransactionsList } from "@/lib/hooks/useTransactions";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const totalBudget = communes.reduce((s, c) => s + c.budget_annuel_fcfa, 0);
  const totalDepense = communes.reduce((s, c) => s + c.budget_depense_fcfa, 0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsGenerating(false);
    alert("Rapport généré avec succès ! Le document sera disponible dans quelques instants.");
  };

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDownloadingId(null);
    // Simulation download
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `Rapport_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-8 rounded-[32px] shadow-2xl shadow-primary/5">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic">Rapports officiels</h2>
          <p className="text-muted-foreground mt-1 font-medium italic">Rapports DGDDL · Audits · Exports nationaux certifiés</p>
        </div>
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-2xl h-14 px-8 font-black text-base transition-all hover:scale-105"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Plus className="w-5 h-5 mr-3" />}
          Générer un rapport
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { label: "Communes couvertes", value: "201", color: "text-primary" },
          { label: "Budget national", value: formatFCFA(totalBudget), color: "text-foreground" },
          { label: "Taux d'exécution", value: totalBudget > 0 ? `${((totalDepense / totalBudget) * 100).toFixed(1)}%` : "—", color: "text-emerald-600" },
          { label: "Transactions", value: transactions.length.toString(), color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="rounded-[24px] border-border/50 shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
              <p className={`text-xl font-black truncate ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[32px] overflow-hidden border shadow-xl">
        <CardHeader className="bg-muted/30 border-b border-border p-6 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-foreground font-black uppercase tracking-widest text-sm">
            <FileText className="w-5 h-5" />
            Tous les rapports disponibles
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl"><Filter size={16} /></Button>
            <Button variant="ghost" size="sm" className="rounded-xl"><Search size={16} /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {RAPPORTS.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-6 hover:bg-muted/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-foreground group-hover:text-primary transition-colors">{r.titre}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant={TYPE_COLORS[r.type] ?? "outline"} className="rounded-lg px-3 py-0.5 text-[9px] font-black">
                        {r.type.toUpperCase()}
                      </Badge>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                        <Calendar className="w-3.5 h-3.5" />
                        {r.date}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter italic">
                        {r.communes} commune{r.communes > 1 ? "s" : ""}
                      </span>
                      {r.montant && (
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-lg">
                          {formatFCFA(r.montant)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <Badge variant={r.statut === "Publié" ? "success" : "outline"} className="rounded-lg h-8 px-4 font-black">
                    {r.statut.toUpperCase()}
                  </Badge>
                  <Button
                    onClick={() => handleDownload(r.id)}
                    disabled={downloadingId === r.id}
                    variant="outline"
                    className="h-12 w-12 rounded-xl border-border hover:bg-primary hover:text-white transition-all"
                  >
                    {downloadingId === r.id ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

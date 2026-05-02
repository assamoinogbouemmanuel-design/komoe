"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Download, FileText, Table } from "lucide-react";
import { useCommunesList } from "@/lib/hooks/useCommunes";
import { useTransactionsList } from "@/lib/hooks/useTransactions";
import { formatFCFA } from "@/lib/constants";

export default function PublicExportPage() {
  const { communes } = useCommunesList();
  const { transactions: txs } = useTransactionsList();
  const confirmes = txs.filter((t) => t.blockchain_tx_hash_validation);

  const exportCSV = (data: object[], filename: string) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const rows = [keys.join(","), ...data.map((r: any) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const EXPORTS = [
    {
      titre: "Communes CI — Open Data",
      desc: `${communes.length} communes · budgets · scores · régions`,
      icone: Table,
      action: () => exportCSV(
        communes.map((c) => ({
          id: c.id, nom: c.nom, region: c.region,
          budget_alloue: c.budget_annuel_fcfa, budget_depense: c.budget_depense_fcfa,
          score_transparence: c.score_transparence,
        })),
        "komoe_open_communes.csv"
      ),
    },
    {
      titre: "Transactions publiques vérifiées",
      desc: `${confirmes.length} transactions blockchain · hash Polygon · IPFS`,
      icone: FileText,
      action: () => exportCSV(
        confirmes.map((t) => ({
          id: t.id, commune_id: t.commune, type: t.type, montant: t.montant_fcfa,
          categorie: t.categorie, date: t.created_at, statut: t.statut,
          tx_hash: t.blockchain_tx_hash_validation, ipfs_hash: t.ipfs_hash ?? "",
        })),
        "komoe_open_transactions.csv"
      ),
    },
    {
      titre: "Toutes les transactions validées",
      desc: `${txs.length} transactions validées`,
      icone: Table,
      action: () => exportCSV(
        txs.map((t) => ({
          id: t.id, commune_id: t.commune, type: t.type, montant: t.montant_fcfa,
          categorie: t.categorie, description: t.description, statut: t.statut, date: t.created_at,
        })),
        "komoe_open_toutes_transactions.csv"
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Export CSV / API</h2>
        <p className="text-muted-foreground mt-1 text-sm">Données ouvertes KOMOE — librement réutilisables</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Communes disponibles</p>
          <p className="text-2xl font-bold text-foreground">{communes.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Transactions on-chain</p>
          <p className="text-2xl font-bold text-foreground">{confirmes.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Volume total public</p>
          <p className="text-xl font-bold text-foreground truncate">{formatFCFA(confirmes.reduce((s, t) => s + t.montant_fcfa, 0))}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-foreground" />
            Fichiers disponibles en téléchargement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {EXPORTS.map(({ titre, desc, icone: Icon, action }) => (
            <div key={titre} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#000040]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{titre}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
              <button
                onClick={action}
                className="flex items-center gap-2 bg-[#000040] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#000060] transition shrink-0 ml-4"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-5">
          <p className="font-semibold text-foreground mb-1">API REST publique</p>
          <p className="text-sm text-muted-foreground mb-3">Accès programmatique aux données KOMOE.</p>
          <div className="space-y-1 font-mono text-xs text-foreground">
            <p className="bg-card border border-blue-100 px-3 py-1.5 rounded-lg">GET /api/communes/</p>
            <p className="bg-card border border-blue-100 px-3 py-1.5 rounded-lg">GET /api/transactions/?statut=CONFIRME</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

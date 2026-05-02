"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Briefcase, ExternalLink, Loader2 } from "lucide-react";
import { useCommunesList } from "@/lib/hooks/useCommunes";
import { useTransactionsList } from "@/lib/hooks/useTransactions";
import { formatFCFA, polygonscanTxUrl, truncateHash } from "@/lib/constants";

export default function ProjetsPage() {
  const { communes, loading: lcLoading } = useCommunesList();
  const { transactions: txs, loading: ltLoading } = useTransactionsList();
  const loading = lcLoading || ltLoading;
  const topCommunes = communes.slice(0, 4);
  const totalFonds = communes.reduce((s, c) => s + c.budget_annuel_fcfa, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Projets financés</h2>
        <p className="text-muted-foreground mt-1 text-sm">Suivi des fonds alloués et dépenses vérifiables sur Polygon</p>
      </div>

      <Card className="bg-gradient-to-r from-[#000040] to-[#000060] text-white border-0">
        <CardContent className="p-6">
          <p className="text-white/60 text-sm mb-1">Vue nationale</p>
          <h3 className="text-xl font-bold mb-3">République de Côte d&apos;Ivoire — Budget 2026</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-white/60 text-xs">Budget consolidé</p>
              <p className="font-bold text-lg">{loading ? "…" : formatFCFA(totalFonds)}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs">Communes actives</p>
              <p className="font-bold text-lg">{communes.length}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs">Transactions validées</p>
              <p className="font-bold text-lg">{txs.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top communes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && <div className="flex justify-center py-6 text-muted-foreground gap-2"><Loader2 className="w-4 h-4 animate-spin" />Chargement…</div>}
            {!loading && topCommunes.map((c) => {
              const pct = c.budget_annuel_fcfa > 0 ? Math.min((c.budget_depense_fcfa / c.budget_annuel_fcfa) * 100, 100) : 0;
              return (
                <div key={c.id} className="p-3 rounded-xl border border-border hover:bg-muted transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{c.nom}</p>
                      <p className="text-xs text-muted-foreground">{c.region}</p>
                    </div>
                    <Badge variant={c.score_transparence >= 70 ? "success" : "secondary"}>
                      Score {c.score_transparence}/100
                    </Badge>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-[#cd6133] to-[#000040]" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatFCFA(c.budget_depense_fcfa)} dépensés</span>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Transactions vérifiables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && <div className="flex justify-center py-6 text-muted-foreground gap-2"><Loader2 className="w-4 h-4 animate-spin" />Chargement…</div>}
            {!loading && txs.slice(0, 6).map((tx) => (
              <div key={tx.id} className="p-3 bg-muted rounded-xl flex justify-between items-center gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{tx.description}</p>
                  {tx.blockchain_tx_hash_validation && (
                    <a
                      href={polygonscanTxUrl(tx.blockchain_tx_hash_validation)}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      {truncateHash(tx.blockchain_tx_hash_validation)} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="font-bold text-sm shrink-0">{formatFCFA(tx.montant_fcfa)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

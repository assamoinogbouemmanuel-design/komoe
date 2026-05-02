"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, ExternalLink, Copy, Loader2 } from "lucide-react";
import { useTransactionsList } from "@/lib/hooks/useTransactions";
import { truncateHash, polygonscanTxUrl, formatFCFA, formatDateShort } from "@/lib/constants";

export default function PreuvesPage() {
  const { transactions, loading } = useTransactionsList();
  const txs = transactions.filter((t) => t.blockchain_tx_hash_validation);

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined") navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Preuves blockchain</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Chaque transaction validée est inscrite de façon immuable sur Polygon Amoy — hash vérifiable sur Polygonscan.
        </p>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Preuves on-chain</p>
            <p className="text-2xl font-bold text-emerald-600">{txs.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Transactions immuables</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avec justificatif IPFS</p>
            <p className="text-2xl font-bold text-teal-600">
              {txs.filter((t) => t.ipfs_hash).length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Documents stockés sur IPFS</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Montant total vérifié</p>
            <p className="text-2xl font-bold text-foreground">
              {formatFCFA(txs.reduce((s, t) => s + t.montant_fcfa, 0))}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Sur Polygon Amoy</p>
          </CardContent>
        </Card>
      </div>

      {/* Preuves détaillées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            Journal d'audit immuable — Polygon Amoy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <div className="flex justify-center py-8 text-muted-foreground gap-2"><Loader2 className="w-4 h-4 animate-spin" />Chargement…</div>}
          {!loading && txs.map((tx) => (
            <div key={tx.id} className="p-4 rounded-xl bg-muted border border-border space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tx.commune_detail?.nom ?? `Commune #${tx.commune}`} · {tx.categorie} · {formatDateShort(tx.validated_at ?? tx.created_at)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-foreground">{formatFCFA(tx.montant_fcfa)}</p>
                  <Badge variant="success">Confirmé</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-muted-foreground w-20 shrink-0">TX Hash</span>
                  <a
                    href={polygonscanTxUrl(tx.blockchain_tx_hash_validation)}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-mono text-purple-600 bg-purple-50 border border-purple-100 px-2 py-1 rounded-lg hover:underline"
                  >
                    {tx.blockchain_tx_hash_validation}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <button onClick={() => copyToClipboard(tx.blockchain_tx_hash_validation)} className="p-1 text-muted-foreground hover:text-muted-foreground rounded" title="Copier">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                {tx.ipfs_hash && (
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-teal-600 bg-teal-50 border border-teal-100 px-2 py-1 rounded-lg font-mono">
                      IPFS: {tx.ipfs_hash}
                      <button onClick={() => copyToClipboard(tx.ipfs_hash)} className="text-teal-400 hover:text-teal-600 ml-1" title="Copier hash IPFS">
                        <Copy className="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

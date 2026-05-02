"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, ExternalLink, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCommuneTransactions } from "@/lib/hooks/useTransactions";
import { transactionsApi } from "@/lib/api";
import { formatFCFA, formatDateShort, polygonscanTxUrl, truncateHash } from "@/lib/constants";

export default function ValidationPage() {
  const { user } = useAuth();
  const communeId = user?.commune ?? null;
  const { transactions, loading, error, refetch } = useCommuneTransactions(communeId);
  const enAttente = transactions.filter((t) => t.statut === "SOUMIS");
  const confirmes = transactions.filter((t) => t.statut === "VALIDE");

  const handleValider = async (id: string) => {
    await transactionsApi.valider(id);
    refetch();
  };

  const handleRejeter = async (id: string) => {
    console.warn("Rejet non encore implémenté pour", id);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Chargement…</span>
    </div>
  );
  if (error) return (
    <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-red-600 text-sm">
      <AlertTriangle className="w-4 h-4" />{error}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">File de validation</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Validez les transactions sur Polygon Amoy — chaque signature est immuable
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">À valider</p>
          <p className="text-2xl font-bold text-amber-600">{enAttente.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Validées</p>
          <p className="text-2xl font-bold text-emerald-600">{confirmes.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Montant à valider</p>
          <p className="text-xl font-bold text-foreground">{formatFCFA(enAttente.reduce((s, t) => s + t.montant_fcfa, 0))}</p>
        </CardContent></Card>
      </div>

      {enAttente.length > 0 && (
        <Card className="border-2 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <CheckCircle className="w-5 h-5" />
              {enAttente.length} transaction(s) en attente de votre signature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {enAttente.map((tx) => (
              <div key={tx.id} className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tx.categorie} · {formatDateShort(tx.created_at)}</p>
                    {tx.ipfs_hash && (
                      <a href={tx.ipfs_url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> Voir justificatif IPFS
                      </a>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-rose-600">{formatFCFA(tx.montant_fcfa)}</p>
                    <Badge variant="secondary">En attente</Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleValider(tx.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#000040] text-white rounded-lg text-xs font-bold hover:bg-[#000060] transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Valider sur Polygon
                  </button>
                  <button
                    onClick={() => handleRejeter(tx.id)}
                    className="px-4 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Transactions déjà validées — Preuves blockchain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {confirmes.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune transaction validée.</p>}
          {confirmes.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border">
              <div>
                <p className="font-semibold text-sm text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{formatDateShort(tx.validated_at ?? tx.created_at)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {tx.blockchain_tx_hash_validation && (
                  <a
                    href={polygonscanTxUrl(tx.blockchain_tx_hash_validation)}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded-lg hover:underline flex items-center gap-1"
                  >
                    {truncateHash(tx.blockchain_tx_hash_validation, 4)} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <Badge variant="success">Validé</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

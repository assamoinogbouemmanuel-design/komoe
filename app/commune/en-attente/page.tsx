"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Clock, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCommuneTransactions } from "@/lib/hooks/useTransactions";
import { formatFCFA, formatDateShort } from "@/lib/constants";

export default function EnAttentePage() {
  const { user } = useAuth();
  const communeId = user?.commune ?? null;
  const { transactions, loading, error } = useCommuneTransactions(communeId);
  const enAttente = transactions.filter(
    (t) => t.statut === "SOUMIS" || t.statut === "BROUILLON"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">En attente de validation</h2>
        <p className="text-muted-foreground mt-1 text-sm">Transactions soumises au Maire — en attente de signature Polygon</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">En attente Maire</p>
          <p className="text-2xl font-bold text-amber-600">{enAttente.filter(t => t.statut === "SOUMIS").length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Brouillons non soumis</p>
          <p className="text-2xl font-bold text-muted-foreground">{enAttente.filter(t => t.statut === "BROUILLON").length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Montant total en attente</p>
          <p className="text-xl font-bold text-foreground">{formatFCFA(enAttente.reduce((s, t) => s + t.montant_fcfa, 0))}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Mes transactions en attente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Chargement…</div>}
          {error && <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg"><AlertTriangle className="w-4 h-4" />{error}</div>}
          {!loading && !error && enAttente.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune transaction en attente.</p>
          )}
          {!loading && !error && enAttente.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div>
                <p className="font-semibold text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tx.categorie} · {formatDateShort(tx.created_at)}</p>
                {tx.ipfs_hash && (
                  <a href={tx.ipfs_url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-1">
                    <ExternalLink className="w-3 h-3" /> Justificatif IPFS
                  </a>
                )}
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="font-bold text-amber-700">{formatFCFA(tx.montant_fcfa)}</p>
                <Badge variant={tx.statut === "SOUMIS" ? "secondary" : "outline"}>
                  {tx.statut === "SOUMIS" ? "En attente" : "Brouillon"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AlertTriangle, Clock, XCircle, TrendingDown, Loader2 } from "lucide-react";
import { useCommunesList } from "@/lib/hooks/useCommunes";
import { useTransactionsList } from "@/lib/hooks/useTransactions";
import { formatFCFA, formatDateShort } from "@/lib/constants";

export default function AlertesPage() {
  const { communes, loading: lcLoading } = useCommunesList();
  const { transactions, loading: ltLoading } = useTransactionsList();
  const loading = lcLoading || ltLoading;

  const communesBas = communes.filter((c) => c.score_transparence < 50);
  const enAttente = transactions.filter((t) => t.statut === "SOUMIS");
  const rejetes = transactions.filter((t) => t.statut === "REJETE");
  const brouillons = transactions.filter((t) => t.statut === "BROUILLON");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Alertes & Retards</h2>
        <p className="text-muted-foreground mt-1 text-sm">Communes à risque · Transactions bloquées · Anomalies détectées</p>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Communes score < 50", value: communesBas.length, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
          { label: "En attente validation", value: enAttente.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Transactions rejetées", value: rejetes.length, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Brouillons non soumis", value: brouillons.length, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Communes à faible score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <TrendingDown className="w-5 h-5" />
            Communes sous surveillance — Score &lt; 50
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <div className="flex justify-center py-4 text-muted-foreground gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Chargement…</div>}
          {!loading && communesBas.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune commune en alerte.</p>
          )}
          {!loading && communesBas.sort((a, b) => a.score_transparence - b.score_transparence).map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
              <div>
                <p className="font-semibold text-foreground">{c.nom}</p>
                <p className="text-xs text-muted-foreground">{c.region}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatFCFA(c.budget_depense_fcfa)} / {formatFCFA(c.budget_annuel_fcfa)} dépensés
                </p>
              </div>
              <Badge variant="destructive">{c.score_transparence}/100</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Transactions en attente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <Clock className="w-5 h-5" />
            Transactions en attente de validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!loading && enAttente.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune transaction en attente.</p>
          )}
          {!loading && enAttente.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div>
                <p className="font-semibold text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.commune_detail?.nom ?? `Commune #${tx.commune}`} · {tx.categorie} · {formatDateShort(tx.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-700">{formatFCFA(tx.montant_fcfa)}</p>
                <Badge variant="secondary">En attente</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Transactions échouées */}
      {rejetes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              Transactions rejetées — Action requise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rejetes.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="font-semibold text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.commune_detail?.nom ?? `Commune #${tx.commune}`} · {tx.categorie} · {formatDateShort(tx.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-700">{formatFCFA(tx.montant_fcfa)}</p>
                  <Badge variant="destructive">Rejeté</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

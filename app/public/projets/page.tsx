"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Briefcase, ExternalLink, Loader2, Globe, CheckCircle2, ShieldCheck } from "lucide-react";
import { useCommunesList } from "@/lib/hooks/useCommunes";
import { useTransactionsList } from "@/lib/hooks/useTransactions";
import { formatFCFA, polygonscanTxUrl, truncateHash } from "@/lib/constants";
import StatsCard from "@/components/ui/StatsCard";

export default function ProjetsPage() {
  const { communes, loading: lcLoading } = useCommunesList();
  const { transactions: txs, loading: ltLoading } = useTransactionsList();
  const loading = lcLoading || ltLoading;
  const topCommunes = communes.slice(0, 5);
  const totalFonds = communes.reduce((s, c) => s + c.budget_annuel_fcfa, 0);
  const totalDepense = communes.reduce((s, c) => s + c.budget_depense_fcfa, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card border border-border p-8 rounded-[32px] shadow-2xl shadow-primary/5">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic flex items-center gap-3">
             <Briefcase className="text-primary" /> Projets & Financements
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
             Suivi transparent des investissements nationaux et de l'aide internationale au développement.
          </p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-2 px-4 rounded-xl flex items-center gap-2">
           <ShieldCheck size={16} /> Fonds sécurisés Blockchain
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Budget Global" value={totalFonds} isCurrency icon={<Globe className="text-primary" />} />
        <StatsCard label="Dépenses Validées" value={totalDepense} isCurrency icon={<CheckCircle2 className="text-emerald-500" />} />
        <StatsCard label="Mairies Actives" value={communes.length} icon={<Briefcase className="text-blue-500" />} />
        <StatsCard label="Transactions" value={txs.length} icon={<ShieldCheck className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 shadow-2xl border-border rounded-[32px] overflow-hidden border">
          <CardHeader className="p-8 border-b border-border bg-muted/30">
            <CardTitle className="text-lg font-black uppercase tracking-widest text-foreground">Top Performances Communales</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {loading && <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-xs font-black uppercase tracking-widest">Analyse des flux...</span>
            </div>}
            {!loading && topCommunes.map((c) => {
              const pct = c.budget_annuel_fcfa > 0 ? Math.min((c.budget_depense_fcfa / c.budget_annuel_fcfa) * 100, 100) : 0;
              return (
                <div key={c.id} className="p-5 rounded-[24px] border border-border hover:border-primary/30 hover:bg-muted/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-lg text-foreground group-hover:text-primary transition-colors">{c.nom}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{c.region}</p>
                    </div>
                    <Badge variant={c.score_transparence >= 70 ? "success" : "secondary"} className="rounded-lg font-black">
                      Score {c.score_transparence}/100
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 p-0.5 border border-border">
                    <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs font-black text-muted-foreground mt-3 uppercase tracking-tighter">
                    <span>{formatFCFA(c.budget_depense_fcfa)} consommés</span>
                    <span className="text-foreground">{pct.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-2xl border-border rounded-[32px] overflow-hidden border">
          <CardHeader className="p-8 border-b border-border bg-muted/30">
            <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-foreground">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Vérification Blockchain
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading && <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>}
            <div className="divide-y divide-border">
              {!loading && txs.slice(0, 8).map((tx) => (
                <div key={tx.id} className="p-6 hover:bg-muted/30 transition-all flex justify-between items-center gap-4 group">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{tx.description}</p>
                    {tx.blockchain_tx_hash_validation && (
                      <a
                        href={polygonscanTxUrl(tx.blockchain_tx_hash_validation)}
                        target="_blank" rel="noopener noreferrer"
                        className="text-[10px] font-mono font-black text-primary hover:underline flex items-center gap-1.5 mt-2 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10 w-max"
                      >
                        {truncateHash(tx.blockchain_tx_hash_validation, 8)} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="font-black text-base text-foreground tabular-nums shrink-0">{formatFCFA(tx.montant_fcfa)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

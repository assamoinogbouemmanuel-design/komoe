"use client";

import { Role, ROLE_LABELS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, ArrowDownRight, Activity,
  Globe, Clock, CheckCircle,
  ShieldCheck, ExternalLink, Loader2, AlertTriangle,
  Wallet, PieChart, BarChart3, Receipt, Building2, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StatsCard from '@/components/ui/StatsCard';
import { useCommunesList } from '@/lib/hooks/useCommunes';
import { useCommuneTransactions, useTransactionsList, STATUT_LABELS, STATUT_VARIANT } from '@/lib/hooks/useTransactions';
import { useAuth } from '@/lib/auth-context';
import { type Commune, type Transaction } from '@/lib/api';
import { formatFCFA, formatDateShort, truncateHash, polygonscanTxUrl } from '@/lib/constants';

interface DashboardViewProps {
  role: Role;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const label = STATUT_LABELS[status] ?? status;
  const variant = STATUT_VARIANT[status] ?? 'outline';
  return <Badge variant={variant as any}>{label}</Badge>;
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-4">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
    <span className="text-sm font-medium tracking-widest uppercase">Synchronisation Polygon...</span>
  </div>
);

const ErrorState = ({ msg }: { msg: string }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold border border-red-200 dark:border-red-900/30">
    <AlertTriangle className="w-5 h-5 shrink-0" />
    {msg}
  </motion.div>
);

// ─── Shared sub-components ───────────────────────────────────────────────────

const RecentTransactionsBlock = ({ txs, title, loading, error }: {
  txs: Transaction[]; title: string; loading?: boolean; error?: string | null;
}) => (
  <Card className="h-full flex flex-col">
    <CardHeader className="border-b border-border dark:border-white/5 pb-4">
      <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        <Activity className="w-4 h-4 text-accent" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-1 p-0 overflow-y-auto no-scrollbar">
      {loading && <div className="p-8"><LoadingState /></div>}
      {!loading && error && <div className="p-4"><ErrorState msg={error} /></div>}
      {!loading && !error && txs.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
          <Receipt className="w-8 h-8 mb-3 opacity-20" />
          <p className="text-sm">Aucune transaction trouvée.</p>
        </div>
      )}
      {!loading && !error && txs.length > 0 && (
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {txs.slice(0, 7).map((tx, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: idx * 0.05 }}
              key={tx.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-muted/50 dark:hover:bg-card/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${tx.type === 'DEPENSE' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                  {tx.type === 'DEPENSE' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{tx.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{formatDateShort(tx.created_at)}</span>
                    {tx.blockchain_tx_hash_validation && (
                      <a
                        href={polygonscanTxUrl(tx.blockchain_tx_hash_validation)}
                        target="_blank" rel="noopener noreferrer"
                        className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 px-2 py-0.5 rounded-md hover:bg-purple-100 transition-colors flex items-center gap-1"
                      >
                        {truncateHash(tx.blockchain_tx_hash_validation, 4)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right mt-3 sm:mt-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <p className={`font-black tracking-tight tabular-nums ${tx.type === 'DEPENSE' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {tx.type === 'DEPENSE' ? '−' : '+'} {formatFCFA(tx.montant_fcfa)}
                </p>
                <StatusBadge status={tx.statut} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const ScoreBar = ({ score }: { score: number }) => (
  <div className="w-24 bg-muted dark:bg-card/5 rounded-full h-1.5 overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${score}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
    />
  </div>
);

// ─── AGENT FINANCIER ─────────────────────────────────────────────────────────
const AgentDashboard = ({ communeId }: { communeId: number }) => {
  const { transactions: all, loading, error } = useCommuneTransactions(communeId);
  const enAttente = all.filter(t => t.statut === 'SOUMIS' || t.statut === 'BROUILLON');
  const valides = all.filter(t => t.statut === 'VALIDE');
  const { communes } = useCommunesList();
  const commune = communes.find(c => c.id === communeId);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Mes saisies ce mois" value={all.length} icon={<Receipt />} />
        <StatsCard label="En attente de validation" value={enAttente.length} icon={<Clock />} />
        <StatsCard label="Budget disponible" value={(commune?.budget_annuel_fcfa ?? 0) - (commune?.budget_depense_fcfa ?? 0)} isCurrency icon={<Wallet />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactionsBlock txs={valides} title="Transactions validées" />
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50/30 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-700 flex items-center gap-2">
                <Clock className="w-4 h-4" /> À valider par le Maire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enAttente.slice(0, 5).map((tx) => (
                <div key={tx.id} className="p-3 bg-card/60 rounded-xl border border-amber-100 shadow-sm">
                  <p className="font-bold text-foreground text-sm line-clamp-1">{tx.description}</p>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{formatDateShort(tx.created_at)}</p>
                    <p className="font-black text-amber-700 tabular-nums">{formatFCFA(tx.montant_fcfa)}</p>
                  </div>
                </div>
              ))}
              {enAttente.length === 0 && <p className="text-xs font-semibold text-amber-600/50 text-center">Aucune transaction en attente.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── MAIRE ────────────────────────────────────────────────────────────────────
const MaireDashboard = ({ communeId }: { communeId: number }) => {
  const { transactions: all, loading, error, refetch } = useCommuneTransactions(communeId);
  const enAttente = all.filter(t => t.statut === 'SOUMIS');
  const valides = all.filter(t => t.statut === 'VALIDE');
  const { communes } = useCommunesList();
  const commune = communes.find(c => c.id === communeId);
  const txRate = commune && commune.budget_annuel_fcfa > 0
    ? ((commune.budget_depense_fcfa / commune.budget_annuel_fcfa) * 100).toFixed(1)
    : '0.0';

  const handleValider = async (id: string) => {
    const { transactionsApi } = await import('@/lib/api');
    await transactionsApi.valider(id);
    refetch();
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Budget Restant" value={(commune?.budget_annuel_fcfa ?? 0) - (commune?.budget_depense_fcfa ?? 0)} isCurrency icon={<Wallet />} />
        <StatsCard label="Dépenses Cumulées" value={commune?.budget_depense_fcfa ?? 0} isCurrency icon={<PieChart />} />
        <StatsCard label="Taux d'exécution" value={`${txRate}%`} icon={<Activity />} />
        <StatsCard label="Score Transparence" value={commune?.score_transparence ?? 0} icon={<ShieldCheck />} />
      </div>
      
      {enAttente.length > 0 && (
        <Card className="border-2 border-amber-400 bg-amber-50/50 dark:bg-amber-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-500">
              <CheckCircle className="w-5 h-5 animate-pulse" />
              Actions requises : {enAttente.length} transaction(s) en attente de signature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {enAttente.map((tx) => (
              <div key={tx.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-card rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/50">
                <div className="mb-3 sm:mb-0">
                  <p className="font-bold text-foreground dark:text-white">{tx.description}</p>
                  <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{tx.categorie} · {formatDateShort(tx.created_at)}</p>
                  {tx.ipfs_hash && (
                    <a href={tx.ipfs_url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mt-2 bg-primary/5 w-max px-2 py-1 rounded-md">
                      <ExternalLink className="w-3 h-3" /> Justificatif IPFS
                    </a>
                  )}
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <p className="font-black text-rose-600 text-lg tabular-nums">{formatFCFA(tx.montant_fcfa)}</p>
                  <button
                    onClick={() => handleValider(tx.id)}
                    className="text-xs font-bold px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-transform hover:scale-105 shadow-md shadow-primary/20 flex items-center gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Signer sur Polygon
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      <div className="h-[400px]">
        <RecentTransactionsBlock txs={valides} title="Dernières transactions confirmées (Blockchain)" />
      </div>
    </div>
  );
};

// ─── DGDDL ────────────────────────────────────────────────────────────────────
const DGDDLDashboard = () => {
  const { communes, loading, error } = useCommunesList();
  const { transactions } = useTransactionsList();
  const totalBudget = communes.reduce((s, c) => s + c.budget_annuel_fcfa, 0);
  const totalDepense = communes.reduce((s, c) => s + c.budget_depense_fcfa, 0);
  const soumises = transactions.filter(t => t.statut === 'SOUMIS').length;
  const sorted = [...communes].sort((a, b) => b.score_transparence - a.score_transparence);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Communes supervisées" value={communes.length} icon={<Building2 />} />
        <StatsCard label="Budget national total" value={totalBudget} isCurrency icon={<Globe />} />
        <StatsCard label="Dépenses consolidées" value={totalDepense} isCurrency icon={<Activity />} />
        <StatsCard label="Alertes en attente" value={soumises} icon={<AlertTriangle />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Palmarès Transparence</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sorted.slice(0, 8).map((c, i) => (
                <div key={c.id} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black", i < 3 ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground")}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{c.nom}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">{c.region}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-black">{c.score_transparence}</span>
                    <ScoreBar score={c.score_transparence} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <RecentTransactionsBlock txs={transactions} title="Flux d'activité national" />
        </div>
      </div>
    </div>
  );
};

// ─── COUR DES COMPTES ─────────────────────────────────────────────────────────
const CourComptesDashboard = () => {
  const { transactions, count, loading, error } = useTransactionsList();
  const { communes } = useCommunesList();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Transactions auditées" value={count} icon={<FileTextIcon />} />
        <StatsCard label="Preuves blockchain valides" value={transactions.filter(t => t.blockchain_tx_hash_validation).length} icon={<ShieldCheck />} />
        <StatsCard label="Mairies connectées" value={communes.length} icon={<Building2 />} />
      </div>
      <Card>
        <CardHeader className="bg-red-50/50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-500 uppercase text-sm tracking-widest font-black">
            <ShieldCheck className="w-5 h-5" />
            Registre d'audit immuable (Livre blanc)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-5 hover:bg-muted/50 dark:hover:bg-card/5 transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4">
                  <p className="font-bold text-foreground dark:text-white truncate">{tx.description}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{tx.categorie} · {formatDateShort(tx.validated_at ?? tx.created_at)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-black text-foreground dark:text-gray-200 tabular-nums">{formatFCFA(tx.montant_fcfa)}</p>
                </div>
                <div className="md:col-span-6 flex items-center justify-end gap-2 flex-wrap">
                  {tx.ipfs_hash && (
                    <span className="text-[10px] font-mono text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-200 px-2 py-1 rounded-md">
                      IPFS: {tx.ipfs_hash.slice(0, 8)}…
                    </span>
                  )}
                  {tx.blockchain_tx_hash_validation ? (
                    <a
                      href={polygonscanTxUrl(tx.blockchain_tx_hash_validation)}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-mono font-bold text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 px-2 py-1 rounded-md hover:bg-purple-100 transition-colors"
                    >
                      TX: {truncateHash(tx.blockchain_tx_hash_validation, 6)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">En attente signature</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── BAILLEUR & CITOYEN & JOURNALISTE (Public) ────────────────────────────────
const PublicDashboard = ({ communeId, role }: { communeId: number | null, role: Role }) => {
  const { communes, loading: lcLoading } = useCommunesList();
  const commune = communeId ? communes.find(c => c.id === communeId) ?? communes[0] : communes[0];
  const { transactions, loading, error } = useTransactionsList(commune ? { commune: commune.id } : undefined);

  if (lcLoading || loading) return <LoadingState />;
  if (!commune && role === 'CITOYEN') return <ErrorState msg="Commune introuvable." />;

  return (
    <div className="space-y-6">
      {/* Hero Banner for Public */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary via-background to-primary p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none mix-blend-screen">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M43.5,-75.4C56.6,-66.1,67.6,-53.4,75.3,-39.1C82.9,-24.8,87.2,-8.8,85.2,6.5C83.2,21.9,74.9,36.5,63.9,48.4C53,60.3,39.4,69.5,24.4,76.5C9.4,83.5,-7.1,88.4,-22.4,85.1C-37.7,81.8,-51.9,70.3,-63.3,56.8C-74.8,43.3,-83.6,27.8,-87.3,11.2C-91.1,-5.4,-89.9,-23,-81.9,-37.2C-73.9,-51.4,-59.2,-62.3,-44.6,-70.6C-30,-78.9,-15,-84.7,0.8,-85.9C16.6,-87.1,33.2,-83.8,43.5,-75.4Z" transform="translate(200 200) scale(1.1)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <Badge className="bg-card/20 hover:bg-card/30 text-white border-white/30 mb-4">{role === 'CITOYEN' ? 'Vue Citoyenne' : 'Accès Public'}</Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{commune ? commune.nom : "Vue Nationale"}</h2>
          {commune && <p className="text-lg font-medium text-white/70">{commune.region}</p>}
          
          <div className="mt-8 flex flex-wrap gap-8">
            <div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Budget 2026</p>
              <p className="text-3xl font-black tabular-nums">{formatFCFA(commune?.budget_annuel_fcfa ?? communes.reduce((s,c)=>s+c.budget_annuel_fcfa,0))}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Dépensé</p>
              <p className="text-3xl font-black tabular-nums text-accent">{formatFCFA(commune?.budget_depense_fcfa ?? communes.reduce((s,c)=>s+c.budget_depense_fcfa,0))}</p>
            </div>
            {commune && (
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Score Transparence</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-black tabular-nums text-emerald-400">{commune.score_transparence}</p>
                  <span className="text-white/40 font-bold">/100</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactionsBlock txs={transactions} title="Flux Financier (Vérifiable sur Polygon)" loading={loading} error={error} />
        </div>
        <div className="lg:col-span-1 space-y-6">
           <Card className="bg-primary text-white border-primary-foreground/10 shadow-xl shadow-primary/20">
             <CardContent className="p-6">
               <h3 className="font-bold text-lg mb-2">Qu'est-ce que cela signifie ?</h3>
               <p className="text-sm text-white/80 leading-relaxed">
                 Chaque transaction affichée ici a été validée cryptographiquement sur la blockchain Polygon. 
                 Les justificatifs sont hébergés sur IPFS, les rendant infalsifiables.
               </p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

// Just a small mock for the icon since I couldn't import FileText from lucide directly in previous block
const FileTextIcon = () => <Activity className="w-5 h-5" />;

// ─── Rendu principal ──────────────────────────────────────────────────────────
export const DashboardView = ({ role }: DashboardViewProps) => {
  const { user } = useAuth();
  const communeId = user?.commune ?? null;

  const renderDashboard = () => {
    switch (role) {
      case 'AGENT_FINANCIER': return communeId ? <AgentDashboard communeId={communeId} /> : <ErrorState msg="Aucune commune associée." />;
      case 'MAIRE':           return communeId ? <MaireDashboard communeId={communeId} /> : <ErrorState msg="Aucune commune associée." />;
      case 'DGDDL':           return <DGDDLDashboard />;
      case 'COUR_COMPTES':    return <CourComptesDashboard />;
      case 'BAILLEUR':        return <PublicDashboard communeId={communeId} role={role} />;
      case 'CITOYEN':         return <PublicDashboard communeId={communeId} role={role} />;
      case 'JOURNALISTE':     return <PublicDashboard communeId={communeId} role={role} />;
      default:                return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground dark:text-white tracking-tight">Tableau de bord</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-md uppercase tracking-widest">{ROLE_LABELS[role]}</span>
            <span className="text-muted-foreground font-medium text-sm border-l border-border dark:border-gray-700 pl-2">Données en temps réel sur la blockchain</span>
          </div>
        </div>
      </div>
      {renderDashboard()}
    </div>
  );
};

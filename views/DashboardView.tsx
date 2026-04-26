import { Role } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, ArrowDownRight, Activity, Building, Briefcase } from 'lucide-react';
import StatsCard from '@/components/ui/StatsCard';
import communesData from '@/mock/communes.json';
import transactionsData from '@/mock/transactions.json';
import institutionsData from '@/mock/institutions.json';
import bailleursData from '@/mock/bailleurs.json';

// Props pour déterminer quel type de tableau de bord afficher
interface DashboardViewProps {
  role: Role;
}

export const DashboardView = ({ role }: DashboardViewProps) => {

  // --- RENDU : TABLEAU DE BORD POUR LES COMMUNES ---
  const renderCommuneDashboard = () => {
    // Récupération de la première commune mockée pour la démo (ex: Cocody)
    const commune = communesData[0];
    const balance = commune.budgetAlloue - commune.budgetDepense;

    return (
      <div className="space-y-6">
        {/* Cartes de statistiques clés en haut */}
        <StatsCard
          label="Budget Restant"
          value={balance}
          isCurrency={true}
          delta="+2.5%"
          trend="up"
        />
        <StatsCard
          label="Dépenses Cumulées"
          value={commune.budgetDepense}
          isCurrency={true}
        />
        <StatsCard
          label="Budget Alloué (2026)"
          value={commune.budgetAlloue}
          isCurrency={true}
        />


        {/* Section pour afficher les dernières transactions sur la blockchain */}
        <h3 className="text-lg font-semibold mt-8 mb-4">Dernières Transactions Blockchain</h3>
        <div className="grid grid-cols-1 gap-4">
          {transactionsData.filter(t => t.communeId === commune.id).map(tx => (
            <Card key={tx.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Icône dynamique selon qu'il s'agisse d'une dépense ou d'une recette */}
                  <div className={`p-3 rounded-full ${tx.type === 'DEPENSE' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {tx.type === 'DEPENSE' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{tx.description}</h4>
                    {/* Affichage du Hash de transaction simulant la preuve on-chain */}
                    <p className="text-sm text-gray-500">Hash: <span className="font-mono text-xs">{tx.txHash}</span> • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold tabular-nums ${tx.type === 'DEPENSE' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {tx.type === 'DEPENSE' ? '-' : '+'} {new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(tx.montant)}
                  </p>
                  <Badge variant="success" className="mt-1">Confirmé</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // --- RENDU : TABLEAU DE BORD POUR LES BAILLEURS DE FONDS ---
  const renderBailleurDashboard = () => {
    // Sélection du premier bailleur pour la démo (ex: Banque Mondiale)
    const bailleur = bailleursData[0];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            label="Fonds Total Alloués (2026)"
            value={bailleur.fondsAlloues}
            isCurrency={true}
          />

          <Card className="shadow-sm border-slate-100 rounded-2xl">
            <CardHeader>
              <CardTitle>Répartition par Commune</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Liste des communes financées avec leur taux d'exécution budgétaire */}
                {bailleur.communesSoutenues.map(cId => {
                  const commune = communesData.find(c => c.id === cId);
                  return commune && (
                    <div key={cId} className="flex justify-between items-center border-b pb-2 last:border-0">
                      <div>
                        <p className="font-semibold">{commune.nom}</p>
                        <p className="text-sm text-gray-500">Taux d'exécution: {((commune.budgetDepense / commune.budgetAlloue) * 100).toFixed(1)}%</p>
                      </div>
                      <Badge variant="outline">{commune.region}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // --- RENDU : TABLEAU DE BORD POUR LES INSTITUTIONS FINANCIÈRES ---
  const renderFinanceDashboard = () => {
    // Récupération de l'institution mockée (ex: BCEAO)
    const inst = institutionsData[0];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            label="Liquidité Globale Supervisée"
            value={inst.niveauLiquidite}
            isCurrency={true}
          />
          <StatsCard
            label="Audits Réalisés (Smart Contracts)"
            value={inst.auditsRealises}
          />
          <StatsCard
            label="Score Conformité"
            value={`${inst.scoreConformite}/100`}
          />
        </div>

        <Card className="shadow-sm border-slate-100 rounded-2xl">
          <CardHeader>
            <CardTitle>Journal d'Audit de Liquidité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Filtrer uniquement les audits de liquidité enregistrés sur la blockchain */}
              {transactionsData.filter(t => t.type === 'AUDIT_LIQUIDITE').map(tx => (
                <div key={tx.id} className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{tx.description}</h4>
                    <p className="text-sm text-gray-500">TxHash: <span className="font-mono text-xs">{tx.txHash}</span></p>
                  </div>
                  <Badge variant="secondary">{new Date(tx.date).toLocaleDateString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // --- RENDU GLOBAL (SWITCH SELON ROLE) ---
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tableau de bord</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Aperçu en temps réel des données sur la blockchain Sepolia.</p>
      </div>

      {/* Affichage conditionnel des blocs spécifiques selon le rôle de l'utilisateur connecté */}
      {role === 'COMMUNE' && renderCommuneDashboard()}
      {role === 'BAILLEUR' && renderBailleurDashboard()}
      {role === 'FINANCE' && renderFinanceDashboard()}
    </div>
  );
};

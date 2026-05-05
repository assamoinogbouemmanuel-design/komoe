"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Users, Building, Activity, Mail, Phone, Wallet, Shield, Edit3, Camera, Receipt, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCommuneDetail } from "@/lib/hooks/useCommunes";
import { Button } from "@/components/ui/Button";
import { useCommuneTransactions } from "@/lib/hooks/useTransactions";

export default function ProfilCommune() {
  const { user } = useAuth();
  const { commune } = useCommuneDetail(user?.commune ?? null);
  const { transactions } = useCommuneTransactions(user?.commune ?? null);
  
  if (!user) return null;

  const initials = `${user.prenom?.charAt(0) || ""}${user.nom?.charAt(0) || ""}`;
  const mesSaisies = transactions.filter(t => t.soumis_par_detail?.id === user.id);
  const totalGere = mesSaisies.reduce((s, t) => s + t.montant_fcfa, 0);

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Mon Profil Agent</h2>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Gérez vos informations personnelles et visualisez vos statistiques.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-6 flex items-center gap-2 shadow-lg shadow-primary/20">
          <Edit3 size={18} /> Modifier le profil
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AGENT PROFILE CARD */}
        <Card className="lg:col-span-4 border-border shadow-2xl rounded-[32px] overflow-hidden bg-card/50 backdrop-blur-xl border relative">
          <div className="h-32 bg-gradient-to-br from-primary via-accent to-secondary opacity-20"></div>
          <CardContent className="px-8 pb-8 -mt-16 text-center">
            <div className="relative inline-block group">
              <div className="w-32 h-32 bg-primary text-white rounded-[40px] flex items-center justify-center font-black text-4xl border-8 border-background shadow-xl mb-4 group-hover:scale-105 transition-transform duration-300">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.full_name} className="w-full h-full object-cover rounded-[32px]" />
                ) : initials}
              </div>
              <button className="absolute bottom-6 right-0 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-lg border border-border text-primary hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>

            <h3 className="text-2xl font-black text-foreground">{user.full_name}</h3>
            <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">Agent Financier</p>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 h-7">Commune de {commune?.nom || "Non assignée"}</Badge>
              <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 h-7 flex items-center gap-1">
                <Shield size={10} /> Compte Vérifié
              </Badge>
            </div>

            <div className="mt-8 space-y-4 text-left border-t border-border pt-6">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Mail size={14} /></div>
                <span className="font-medium truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Phone size={14} /></div>
                <span className="font-medium">{user.telephone || "+225 00 00 00 00"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Wallet size={14} /></div>
                <span className="font-mono text-xs font-bold text-primary truncate max-w-[180px]">{user.wallet_address || "Non liée"}</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="bg-muted/50 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black text-foreground">{mesSaisies.length}</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Saisies</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black text-foreground">98%</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Fiabilité</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COMMUNE INFO & STATS */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-border shadow-lg rounded-3xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Activity size={16} className="text-primary" /> Statistiques d'activité
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Receipt size={20} /></div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase">Budget Total Géré</p>
                          <p className="text-lg font-black text-foreground">{new Intl.NumberFormat('fr-CI').format(totalGere)} FCFA</p>
                        </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center"><Clock size={20} /></div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase">En attente signature</p>
                          <p className="text-lg font-black text-foreground">{mesSaisies.filter(t => t.statut === "SOUMIS").length} transactions</p>
                        </div>
                     </div>
                   </div>
                </CardContent>
             </Card>
 
             <Card className="border-border shadow-lg rounded-3xl overflow-hidden flex flex-col">
              <CardHeader className="bg-muted/30 border-b border-border">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <MapPin size={16} className="text-primary" /> Localisation Commune
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 relative min-h-[180px]">
                <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/13/4011/3956.png')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-card/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-border text-center">
                    <p className="font-black text-foreground text-xs uppercase tracking-tighter">Mairie de {commune?.nom}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border shadow-lg rounded-[32px] overflow-hidden">
             <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-black text-foreground flex items-center gap-3">
                  <Building className="text-primary" /> Informations de la Commune
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Région / District</p>
                    <p className="text-lg font-bold text-foreground">{commune?.region || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Maire actuel</p>
                    <p className="text-lg font-bold text-foreground">{commune?.maire_nom || "Non défini"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Budget Primitif Annuel</p>
                    <p className="text-lg font-bold text-foreground text-primary">{new Intl.NumberFormat('fr-CI').format(commune?.budget_annuel_fcfa || 0)} FCFA</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Score Transparence</p>
                    <div className="flex items-center gap-3">
                       <p className="text-2xl font-black text-emerald-500">{commune?.score_transparence}/100</p>
                       <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${commune?.score_transparence}%` }}></div>
                       </div>
                    </div>
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

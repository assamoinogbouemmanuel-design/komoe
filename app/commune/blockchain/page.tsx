"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Activity, Server, ShieldCheck, Box, Network, Globe } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import dynamic from 'next/dynamic';
import { Badge } from "@/components/ui/Badge";

const BlockchainMap = dynamic(() => import('@/components/ui/BlockchainMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-primary/5 rounded-3xl animate-pulse flex flex-col items-center justify-center text-muted-foreground gap-4">
    <Globe className="w-12 h-12 animate-spin text-primary/20" />
    <span className="text-sm font-black uppercase tracking-widest opacity-40">Chargement de la carte décentralisée...</span>
  </div>
});

export default function BlockchainCommune() {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Réseau Polygon Amoy</h2>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Surveillance du nœud communal et intégrité de la sidechain.</p>
        </div>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 py-2 px-4 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          Mainnet Node Status: Online
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Dernier Bloc" value={6529188} icon={<Box className="text-primary" />} />
        <StatsCard label="Temps de Bloc" value="2.1s" trend="down" icon={<Activity className="text-emerald-500" />} />
        <StatsCard label="Transactions/Sec" value={24} icon={<Activity className="text-blue-500" />} />
        <StatsCard label="Contrats Déployés" value={12} icon={<ShieldCheck className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-2xl border-border rounded-[32px] overflow-hidden border">
          <CardHeader className="bg-muted/30 border-b border-border p-6">
            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3 text-foreground">
              <Server className="text-primary" size={20} />
              Nœud de la Commune
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-2xl border border-border">
                <span className="text-xs font-black uppercase text-muted-foreground">Réseau Actif</span>
                <span className="text-sm font-black text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-xl">Polygon Amoy</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-2xl border border-border">
                <span className="text-xs font-black uppercase text-muted-foreground">ID Chaîne</span>
                <span className="text-sm font-black text-foreground">80002</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-2xl border border-border">
                <span className="text-xs font-black uppercase text-muted-foreground">Type de Nœud</span>
                <span className="text-sm font-black text-foreground">Validator Node</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-2xl border border-border">
                <span className="text-xs font-black uppercase text-muted-foreground">Client Logiciel</span>
                <span className="text-sm font-mono font-bold text-muted-foreground italic">Erigon v2.56.0-polygon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-2xl border-border rounded-[32px] overflow-hidden border">
          <CardHeader className="bg-muted/30 border-b border-border p-6">
            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3 text-foreground">
              <Box className="text-primary" size={20} />
              Journal des Blocs (Temps Réel)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center p-5 hover:bg-muted/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                      <Box size={20} />
                    </div>
                    <div>
                      <p className="text-base font-black text-foreground tabular-nums">#6529{188 - i}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Il y a {i * 2 + 1} secondes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-muted-foreground mb-1">0x{Math.random().toString(16).slice(2, 40)}...</p>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-black">CONFIRMÉ</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-2xl border-border rounded-[32px] overflow-hidden border">
        <CardHeader className="bg-muted/30 border-b border-border p-6">
          <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3 text-foreground">
            <Globe className="text-primary" size={20} />
            Topologie du Réseau Décentralisé KOMOE
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <BlockchainMap />
            <div className="absolute bottom-6 right-6 bg-background/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/50"></div>
                  <span className="text-xs font-black uppercase tracking-widest">Nœuds Nationaux (15)</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></div>
                  <span className="text-xs font-black uppercase tracking-widest">Nœuds Relais Polygon (8)</span>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Activity, Server, ShieldCheck, Box } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import dynamic from 'next/dynamic';

const BlockchainMap = dynamic(() => import('@/components/ui/BlockchainMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-primary rounded-3xl animate-pulse flex items-center justify-center text-muted-foreground">Chargement de la carte décentralisée...</div>
});

export default function BlockchainCommune() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Réseau Blockchain</h2>
        <p className="text-muted-foreground mt-1 font-medium text-sm">État du nœud local et synchronisation avec le réseau Sepolia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Blocs Synchronisés" value={4529188} />
        <StatsCard label="Latence Réseau" value="12ms" trend="down" />
        <StatsCard label="Transactions" value={142} />
        <StatsCard label="Smart Contracts" value={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="text-brand-blue" />
              Statut du Nœud Local
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
                <span className="text-sm font-bold text-foreground">Réseau</span>
                <span className="text-sm font-mono text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Ethereum Sepolia</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
                <span className="text-sm font-bold text-foreground">Connexion</span>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
                <span className="text-sm font-bold text-foreground">Client Consensus</span>
                <span className="text-sm font-mono text-muted-foreground">Lighthouse v4.5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Box className="text-brand-orange" />
              Derniers Blocs Validés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/50 rounded-lg text-muted-foreground">
                      <Box size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-mono font-bold text-foreground">#45291{88 - i}</p>
                      <p className="text-xs text-muted-foreground">Il y a {i * 12} secondes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground">0x8f2a...{Math.random().toString(16).slice(2, 6)}</p>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase">Validé</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="shadow-sm border-border rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Cartographie du Réseau Décentralisé (Nœuds)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BlockchainMap />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

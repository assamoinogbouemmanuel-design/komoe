"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ExternalLink, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TransactionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <Link href="/commune/transactions" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-brand-blue mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour au registre
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Détails de la Transaction</h2>
            <Badge variant="success">Confirmé On-Chain</Badge>
          </div>
          <p className="text-muted-foreground font-mono text-sm">ID Interne: {id}</p>
        </div>
        <Button variant="outline" className="gap-2 text-brand-blue border-brand-blue/20 hover:bg-brand-blue hover:text-white">
          <ExternalLink size={16} /> Explorer (Etherscan)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2 shadow-sm border-border rounded-3xl">
          <CardContent className="p-8">
            <h3 className="text-lg font-bold text-foreground mb-6">Informations Budgétaires</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                <p className="font-medium text-foreground">Achat de matériel informatique pour la mairie centrale</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Montant</p>
                <p className="text-2xl font-black text-brand-orange">12 500 000 FCFA</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Catégorie</p>
                <p className="font-medium text-foreground">Équipement</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Date d'exécution</p>
                <p className="font-medium text-foreground">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="col-span-2 border-t border-border pt-4 mt-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Preuve Cryptographique (Hash)</p>
                <div className="bg-muted border border-border p-4 rounded-xl font-mono text-sm text-muted-foreground break-all flex justify-between items-center">
                  <span>0x8f2a9c4b123d9e87f54c987a0b345e678f2a9c4b123d9e87f54c987a0b345e67</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border rounded-3xl bg-muted">
          <CardContent className="p-6">
            <h3 className="text-md font-bold text-foreground mb-4">Pièces Justificatives</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg"><FileText size={16} /></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">Facture_Fournisseur.pdf</p>
                  <p className="text-[10px] text-muted-foreground">2.4 MB</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg"><FileText size={16} /></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">Bon_Commande.pdf</p>
                  <p className="text-[10px] text-muted-foreground">1.1 MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border rounded-3xl">
        <CardContent className="p-8">
          <h3 className="text-lg font-bold text-foreground mb-6">Historique d'Approbation (Multisig)</h3>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-200 before:via-emerald-200 before:to-transparent">
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                <CheckCircle2 size={20} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-foreground">Validation Maire</div>
                  <time className="font-mono text-xs text-muted-foreground">{new Date().toLocaleString()}</time>
                </div>
                <div className="text-muted-foreground text-sm">Signature électronique requise par contrat (1/2).</div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                <CheckCircle2 size={20} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-foreground">Validation DAF</div>
                  <time className="font-mono text-xs text-muted-foreground">{new Date(Date.now() - 3600000).toLocaleString()}</time>
                </div>
                <div className="text-muted-foreground text-sm">Vérification budgétaire effectuée (2/2).</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/Card";
import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, Key, Loader2, CheckCircle2, UserMinus, AlertTriangle } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { FormField, Input, Select } from "@/components/ui/ReusableForm";
import { useState } from "react";

export default function RolesCommune() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState<number | null>(null);

  const roles = [
    { id: 1, nom: "Maire", adresse: "0x1234...5678", niveau: "Admin", statut: "Actif" },
    { id: 2, nom: "Directeur Financier", adresse: "0xabcd...ef01", niveau: "Éditeur", statut: "Actif" },
    { id: 3, nom: "Auditeur Interne", adresse: "0x9876...5432", niveau: "Lecteur", statut: "Actif" },
  ];

  const columns: ColumnConfig<any>[] = [
    { header: 'Agent / Fonction', key: 'nom', render: (val) => <span className="font-black text-foreground">{val}</span> },
    { 
      header: 'Adresse Wallet (Multisig)', 
      key: 'adresse', 
      render: (val) => (
        <span className="font-mono text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 text-[10px] font-black">
          {val}
        </span>
      ) 
    },
    {
      header: 'Niveau d\'accès',
      key: 'niveau',
      render: (val) => (
        <Badge variant={val === 'Admin' ? 'destructive' : 'secondary'} className="rounded-lg px-3 py-1 font-black text-[10px]">
          {val.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Statut',
      key: 'statut',
      render: (val) => (
        <Badge variant="success" className="rounded-lg px-3 py-1 font-black text-[10px]">
          {val.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, item) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          onClick={() => setConfirmRevoke(item.id)}
        >
          <UserMinus size={16} />
        </Button>
      )
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsDrawerOpen(false);
    }, 2000);
  };

  const handleRevoke = async () => {
    // Simulation
    setConfirmRevoke(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-card border border-border p-8 rounded-[32px] shadow-2xl shadow-primary/5">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic">Rôles & Accès (Multisig)</h2>
          <p className="text-muted-foreground mt-2 font-medium">Gestion des privilèges et des clés de signature Blockchain.</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-2xl h-14 px-8 font-black text-base transition-all hover:scale-105" 
          onClick={() => setIsDrawerOpen(true)}
        >
          <Key className="w-5 h-5 mr-3" />
          Ajouter un signataire
        </Button>
      </div>

      <Card className="shadow-xl border-amber-200/50 bg-amber-50/20 dark:bg-amber-900/10 rounded-[32px] overflow-hidden">
        <CardContent className="p-8 flex items-start gap-6">
          <div className="p-4 bg-amber-400 text-white rounded-[24px] shadow-lg shadow-amber-400/20">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-amber-900 dark:text-amber-500 uppercase tracking-tight">Protocole de Sécurité Multisig</h3>
            <p className="text-sm font-bold text-amber-900/70 dark:text-amber-400/70 mt-2 leading-relaxed">
              Toute dépense supérieure à <span className="text-amber-600 font-black">10,000,000 FCFA</span> nécessite obligatoirement la signature électronique de deux (2) administrateurs distincts pour être inscrite dans la Blockchain Polygon.
            </p>
          </div>
        </CardContent>
      </Card>

      <DataTable 
        title="Liste des Signataires Autorisés"
        columns={columns}
        data={roles}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => !isSubmitting && setIsDrawerOpen(false)} title="Nouveau Signataire Blockchain">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
               <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-black text-foreground">Signataire ajouté !</h3>
            <p className="text-muted-foreground text-sm mt-2 text-center max-w-[250px]">
              La mise à jour du contrat Multisig sur Polygon est en cours de propagation.
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormField label="Nom Complet de l'Agent" required>
              <Input placeholder="Ex: Jean Kouadio" required disabled={isSubmitting} />
            </FormField>
            
            <FormField label="Adresse du Portefeuille (Wallet) Polygon" required>
              <Input placeholder="0x..." required className="font-mono" disabled={isSubmitting} />
            </FormField>

            <FormField label="Niveau d'Autorisation" required>
              <Select required disabled={isSubmitting}>
                <option value="Admin">Administrateur (Signature active)</option>
                <option value="Editeur">Éditeur (Saisie uniquement)</option>
                <option value="Lecteur">Lecteur / Auditeur</option>
              </Select>
            </FormField>

            <div className="pt-6 border-t border-border flex justify-end space-x-3">
              <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)} disabled={isSubmitting}>Annuler</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : <Key size={18} className="mr-2" />}
                Ajouter au contrat
              </Button>
            </div>
          </form>
        )}
      </Drawer>

      {/* Confirmation de Révocation */}
      {confirmRevoke && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full rounded-[32px] shadow-2xl border-rose-200 animate-in zoom-in duration-300">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border-2 border-rose-100">
                 <AlertTriangle size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">Révoquer l'accès ?</h3>
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                  Cette action supprimera immédiatement les droits de signature de cet agent sur le contrat Multisig. Cette opération est irréversible.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={handleRevoke} className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-14 font-black">
                   Confirmer la révocation
                </Button>
                <Button variant="ghost" onClick={() => setConfirmRevoke(null)} className="rounded-2xl h-12 font-bold">
                   Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/Card";
import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, Key } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { FormField, Input, Select } from "@/components/ui/ReusableForm";
import { useState } from "react";

export default function RolesCommune() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const roles = [
    { id: 1, nom: "Maire", adresse: "0x1234...5678", niveau: "Admin", statut: "Actif" },
    { id: 2, nom: "Directeur Financier", adresse: "0xabcd...ef01", niveau: "Éditeur", statut: "Actif" },
    { id: 3, nom: "Auditeur Interne", adresse: "0x9876...5432", niveau: "Lecteur", statut: "Actif" },
  ];

  const columns: ColumnConfig<any>[] = [
    { header: 'Agent / Fonction', key: 'nom' },
    { header: 'Adresse Wallet (Multisig)', key: 'adresse', render: (val) => <span className="font-mono text-brand-blue bg-blue-50 px-2 py-1 rounded text-xs">{val}</span> },
    {
      header: 'Niveau d\'accès',
      key: 'niveau',
      render: (val) => <Badge variant={val === 'Admin' ? 'destructive' : 'secondary'}>{val}</Badge>
    },
    {
      header: 'Statut',
      key: 'statut',
      render: (val) => <Badge variant="success">{val}</Badge>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: () => <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500">Révoquer</Button>
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rôles & Accès (Multisig)</h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">Gestion des signataires autorisés pour les transactions budgétaires.</p>
        </div>
        <Button className="bg-brand-orange hover:bg-[#b05020] text-white" onClick={() => setIsDrawerOpen(true)}>
          <Key className="w-4 h-4 mr-2" />
          Ajouter un signataire
        </Button>
      </div>

      <Card className="mb-8 shadow-sm border-amber-100 bg-amber-50/30 rounded-3xl">
        <CardContent className="p-6 flex items-start space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">Sécurité Multisig Activée</h3>
            <p className="text-sm text-amber-700 mt-1">Toute dépense supérieure à 10,000,000 FCFA nécessite la signature d'au moins 2 administrateurs (Maire + DAF) pour être validée sur la blockchain.</p>
          </div>
        </CardContent>
      </Card>

      <DataTable 
        title="Signataires Autorisés"
        columns={columns}
        data={roles}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Ajouter un signataire Multisig">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsDrawerOpen(false); }}>
          <FormField label="Nom Complet de l'Agent" required>
            <Input placeholder="Ex: Jean Kouadio" required />
          </FormField>
          
          <FormField label="Adresse du Portefeuille (Wallet) Ethereum" required>
            <Input placeholder="0x..." required className="font-mono" />
          </FormField>

          <FormField label="Niveau d'Autorisation" required>
            <Select required>
              <option value="Admin">Administrateur (Maire / DAF)</option>
              <option value="Editeur">Éditeur (Comptable)</option>
              <option value="Lecteur">Lecteur / Auditeur</option>
            </Select>
          </FormField>

          <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
            <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)}>Annuler</Button>
            <Button type="submit" className="bg-brand-orange hover:bg-[#b05020] text-white">Ajouter au contrat</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

"use client";

import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { FormField, Input, Select, RichTextEditor, ImageUpload } from "@/components/ui/ReusableForm";
import { useState } from "react";
import Link from "next/link";

export default function SignalementsCommune() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const signalements = [
    { id: 'SIG-001', titre: "Nid de poule dangereux", categorie: "Voirie", date: "2026-04-20", statut: "En cours", votes: 45 },
    { id: 'SIG-002', titre: "Lampadaire défectueux", categorie: "Éclairage", date: "2026-04-22", statut: "Nouveau", votes: 12 },
    { id: 'SIG-003', titre: "Fuite d'eau publique", categorie: "Assainissement", date: "2026-04-18", statut: "Résolu", votes: 89 },
    { id: 'SIG-004', titre: "Décharge sauvage", categorie: "Propreté", date: "2026-04-25", statut: "Nouveau", votes: 5 },
  ];

  const columns: ColumnConfig<any>[] = [
    { header: 'ID', key: 'id', render: (val) => <span className="font-mono text-xs">{val}</span> },
    {
      header: 'Signalement',
      key: 'titre',
      render: (val, item) => (
        <div>
          <div className="font-bold text-foreground">{val}</div>
          <div className="text-xs text-muted-foreground mt-1">{item.categorie} • {new Date(item.date).toLocaleDateString()}</div>
        </div>
      )
    },
    {
      header: 'Soutiens (Votes)',
      key: 'votes',
      render: (val) => <span className="font-bold text-brand-orange">{val} citoyens</span>
    },
    {
      header: 'Statut',
      key: 'statut',
      render: (val) => (
        <Badge variant={val === 'Résolu' ? 'success' : val === 'En cours' ? 'default' : 'secondary'}>
          {val}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, item) => (
        <Link href={`/commune/signalements/${item.id}`}>
          <Button variant="outline" size="sm">Détails</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Signalements Citoyens</h2>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Incidents et requêtes remontés par la population.</p>
        </div>
        <Button className="bg-brand-orange hover:bg-[#b05020] text-white shadow-md" onClick={() => setIsDrawerOpen(true)}>
          + Nouveau Signalement
        </Button>
      </div>

      <DataTable 
        title="Derniers Signalements"
        columns={columns}
        data={signalements}
      />

      {/* Modale Latérale (Drawer) pour Ajouter un Signalement */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Déclarer un incident">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsDrawerOpen(false); }}>
          <FormField label="Titre du signalement" required>
            <Input placeholder="Ex: Lampadaire défectueux au carrefour..." required />
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Catégorie" required>
              <Select required>
                <option value="Voirie">Voirie & Réseaux</option>
                <option value="Éclairage">Éclairage Public</option>
                <option value="Propreté">Propreté & Déchets</option>
                <option value="Sécurité">Sécurité</option>
              </Select>
            </FormField>
            <FormField label="Quartier/Localisation" required>
              <Input placeholder="Ex: Riviera Palmeraie" required />
            </FormField>
          </div>

          <FormField label="Description détaillée" required>
            <RichTextEditor name="description" placeholder="Décrivez le problème observé..." />
          </FormField>

          <FormField label="Photos justificatives">
            <ImageUpload name="photos" maxImages={3} />
          </FormField>

          <div className="pt-6 border-t border-border flex justify-end space-x-3">
            <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)}>Annuler</Button>
            <Button type="submit" className="bg-brand-orange hover:bg-[#b05020] text-white">Soumettre</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

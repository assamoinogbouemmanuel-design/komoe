"use client";

import DataTable, { ColumnConfig } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { FormField, Input, Select, RichTextEditor, ImageUpload } from "@/components/ui/ReusableForm";
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Loader2, MapPin, MessageSquare, ThumbsUp } from "lucide-react";

export default function SignalementsCommune() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const signalements = [
    { id: 'SIG-001', titre: "Nid de poule dangereux", categorie: "Voirie", date: "2026-04-20", statut: "En cours", votes: 45 },
    { id: 'SIG-002', titre: "Lampadaire défectueux", categorie: "Éclairage", date: "2026-04-22", statut: "Nouveau", votes: 12 },
    { id: 'SIG-003', titre: "Fuite d'eau publique", categorie: "Assainissement", date: "2026-04-18", statut: "Résolu", votes: 89 },
    { id: 'SIG-004', titre: "Décharge sauvage", categorie: "Propreté", date: "2026-04-25", statut: "Nouveau", votes: 5 },
  ];

  const columns: ColumnConfig<any>[] = [
    { header: 'ID', key: 'id', render: (val) => <span className="font-mono text-[10px] font-black uppercase text-muted-foreground">{val}</span> },
    {
      header: 'Signalement',
      key: 'titre',
      render: (val, item) => (
        <div className="py-2">
          <div className="font-black text-foreground group-hover:text-primary transition-colors">{val}</div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
            <Badge variant="outline" className="text-[9px] px-2 py-0 h-4 border-muted-foreground/20">{item.categorie}</Badge>
            <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Soutiens',
      key: 'votes',
      render: (val) => (
        <div className="flex items-center gap-2 font-black text-amber-600">
           <ThumbsUp size={14} />
           <span>{val} votes</span>
        </div>
      )
    },
    {
      header: 'Statut',
      key: 'statut',
      render: (val) => (
        <Badge variant={val === 'Résolu' ? 'success' : val === 'En cours' ? 'default' : 'secondary'} className="rounded-lg px-3 py-1 font-black text-[10px]">
          {val.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, item) => (
        <Link href={`/commune/signalements/${item.id}`}>
          <Button variant="outline" size="sm" className="rounded-xl font-black text-xs hover:bg-primary hover:text-white transition-all">
            Détails
          </Button>
        </Link>
      )
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsDrawerOpen(false);
    }, 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card border border-border p-8 rounded-[32px] shadow-2xl shadow-primary/5">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic flex items-center gap-3">
             <MessageSquare className="text-primary" /> Signalements Citoyens
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
             Suivi participatif des incidents et requêtes de la population.
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-2xl h-14 px-8 font-black text-base transition-all hover:scale-105" 
          onClick={() => setIsDrawerOpen(true)}
        >
          + Déclarer un incident
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <DataTable 
              title="Flux des signalements"
              columns={columns}
              data={signalements}
            />
         </div>
         <div className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 p-6 rounded-[28px]">
               <h3 className="text-amber-800 dark:text-amber-500 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} /> Priorité Haute
               </h3>
               <p className="text-sm font-bold text-amber-900/80 dark:text-amber-400/80 leading-relaxed">
                  3 signalements concernant la voirie ont dépassé les 50 votes cette semaine.
               </p>
               <Button variant="outline" className="w-full mt-4 rounded-xl border-amber-200 text-amber-700 font-black text-xs h-10">
                  Voir les urgences
               </Button>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 p-6 rounded-[28px]">
               <h3 className="text-emerald-800 dark:text-emerald-500 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Impact Hebdo
               </h3>
               <p className="text-sm font-bold text-emerald-900/80 dark:text-emerald-400/80 leading-relaxed">
                  12 incidents résolus en 7 jours. Un record de réactivité pour la commune !
               </p>
            </div>
         </div>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => !isSubmitting && setIsDrawerOpen(false)} title="Nouveau Signalement">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
               <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-black text-foreground">Signalement Enregistré !</h3>
            <p className="text-muted-foreground text-sm mt-2 text-center max-w-[250px]">
              L'incident a été publié et sera visible par les services techniques.
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormField label="Titre du signalement" required>
              <Input placeholder="Ex: Lampadaire défectueux au carrefour..." required disabled={isSubmitting} />
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Catégorie" required>
                <Select required disabled={isSubmitting}>
                  <option value="Voirie">Voirie & Réseaux</option>
                  <option value="Éclairage">Éclairage Public</option>
                  <option value="Propreté">Propreté & Déchets</option>
                  <option value="Sécurité">Sécurité</option>
                </Select>
              </FormField>
              <FormField label="Quartier/Localisation" required>
                <div className="relative">
                  <Input placeholder="Ex: Riviera Palmeraie" required disabled={isSubmitting} className="pl-10" />
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </FormField>
            </div>

            <FormField label="Description détaillée" required>
              <RichTextEditor name="description" placeholder="Décrivez le problème observé..." />
            </FormField>

            <FormField label="Photos justificatives">
              <ImageUpload name="photos" maxImages={3} />
            </FormField>

            <div className="pt-6 border-t border-border flex justify-end space-x-3">
              <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)} disabled={isSubmitting}>Annuler</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Envoi...
                  </>
                ) : "Soumettre le signalement"}
              </Button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
}

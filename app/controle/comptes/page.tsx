"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Search, ShieldCheck, Building2, Globe, Plus, Loader2, CheckCircle2, Mail, User } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/ReusableForm";

const COMPTES_MOCK = [
  { id: "U-001", nom: "Kouassi", prenom: "Amani Jean", email: "dgddl@komoe.ci", role: "DGDDL", commune: null, actif: true },
  { id: "U-002", nom: "Bamba", prenom: "Fatoumata", email: "cour.comptes@komoe.ci", role: "COUR_COMPTES", commune: null, actif: true },
  { id: "U-003", nom: "Ouattara", prenom: "Ibrahim", email: "bailleur@komoe.ci", role: "BAILLEUR", commune: null, actif: true },
  { id: "U-004", nom: "Konan", prenom: "Serge", email: "maire.abobo@komoe.ci", role: "MAIRE", commune: "Abobo", actif: true },
  { id: "U-005", nom: "Diallo", prenom: "Kadiatou", email: "agent.abobo@komoe.ci", role: "AGENT_FINANCIER", commune: "Abobo", actif: true },
  { id: "U-006", nom: "Traoré", prenom: "Moussa", email: "maire.yopougon@komoe.ci", role: "MAIRE", commune: "Yopougon", actif: true },
  { id: "U-007", nom: "Koffi", prenom: "Aya", email: "agent.yopougon@komoe.ci", role: "AGENT_FINANCIER", commune: "Yopougon", actif: false },
  { id: "U-008", nom: "Coulibaly", prenom: "Seydou", email: "maire.bouake@komoe.ci", role: "MAIRE", commune: "Bouaké", actif: true },
  { id: "U-009", nom: "Soro", prenom: "Mariam", email: "agent.bouake@komoe.ci", role: "AGENT_FINANCIER", commune: "Bouaké", actif: true },
  { id: "U-010", nom: "Aka", prenom: "Bernard", email: "citoyen@komoe.ci", role: "CITOYEN", commune: null, actif: true },
  { id: "U-011", nom: "N'Guessan", prenom: "Sylvie", email: "journaliste@komoe.ci", role: "JOURNALISTE", commune: null, actif: true },
];

const ROLE_LABELS: Record<string, string> = {
  DGDDL: "DGDDL",
  COUR_COMPTES: "Cour des Comptes",
  BAILLEUR: "Bailleur",
  MAIRE: "Maire",
  AGENT_FINANCIER: "Agent Financier",
  CITOYEN: "Citoyen",
  JOURNALISTE: "Journaliste",
};

const ROLE_COLORS: Record<string, "success" | "secondary" | "outline" | "destructive"> = {
  DGDDL: "success",
  COUR_COMPTES: "destructive",
  BAILLEUR: "secondary",
  MAIRE: "success",
  AGENT_FINANCIER: "secondary",
  CITOYEN: "outline",
  JOURNALISTE: "outline",
};

export default function ComptesPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const roles = ["Tous", ...Array.from(new Set(COMPTES_MOCK.map((u) => u.role)))];

  const filtered = COMPTES_MOCK.filter((u) => {
    const fullName = `${u.prenom} ${u.nom}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Tous" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsDrawerOpen(false);
    }, 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-8 rounded-[32px] shadow-2xl shadow-primary/5">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic">Gestion des accès</h2>
          <p className="text-muted-foreground mt-1 font-medium italic">Annuaire centralisé des utilisateurs de la plateforme Komoe</p>
        </div>
        <Button 
          onClick={() => setIsDrawerOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-2xl h-14 px-8 font-black text-base transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-3" />
          Nouveau compte
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { label: "Total comptes", value: COMPTES_MOCK.length, icon: Users, color: "text-foreground" },
          { label: "Mairies", value: COMPTES_MOCK.filter(u => u.role === "MAIRE" || u.role === "AGENT_FINANCIER").length, icon: Building2, color: "text-primary" },
          { label: "Institutions", value: COMPTES_MOCK.filter(u => ["DGDDL","COUR_COMPTES","BAILLEUR"].includes(u.role)).length, icon: ShieldCheck, color: "text-amber-500" },
          { label: "En ligne", value: COMPTES_MOCK.filter(u => u.actif).length, icon: Globe, color: "text-emerald-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="rounded-[24px] border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-6 relative">
              <Icon className={`w-12 h-12 ${color} absolute -right-2 -bottom-2 opacity-5`} />
              <p className="text-3xl font-black text-foreground">{value}</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 rounded-[32px] overflow-hidden border shadow-xl">
          <CardHeader className="bg-muted/30 border-b border-border p-6 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filtrer par nom, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-bold text-sm w-full md:w-64"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-muted/50 border border-border rounded-xl px-3 py-1.5 text-xs font-black uppercase"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r === "Tous" ? "Tous les rôles" : ROLE_LABELS[r] ?? r}</option>
              ))}
            </select>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Utilisateur</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden sm:table-cell">Contact</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fonction</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden md:table-cell">Affectation</th>
                    <th className="text-right px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/20 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                             {u.prenom[0]}{u.nom[0]}
                          </div>
                          <span className="font-black text-foreground group-hover:text-primary transition-colors">{u.prenom} {u.nom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell font-medium text-xs italic">{u.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={ROLE_COLORS[u.role] ?? "outline"} className="rounded-lg px-3 py-0.5 text-[9px] font-black">
                          {ROLE_LABELS[u.role]?.toUpperCase() ?? u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden md:table-cell font-bold text-xs">{u.commune ?? "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant={u.actif ? "success" : "destructive"} className="rounded-lg px-2 h-6 text-[9px] font-black">
                          {u.actif ? "ACTIF" : "INACTIF"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => !isSubmitting && setIsDrawerOpen(false)} title="Création de compte">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
               <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-black text-foreground">Compte Créé !</h3>
            <p className="text-muted-foreground text-sm mt-2 text-center max-w-[250px]">
              L'utilisateur recevra ses accès de connexion par email sous peu.
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Prénom" required>
                <div className="relative">
                  <Input placeholder="Jean" required disabled={isSubmitting} className="pl-10" />
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </FormField>
              <FormField label="Nom" required>
                <Input placeholder="Kouadio" required disabled={isSubmitting} />
              </FormField>
            </div>
            
            <FormField label="Email professionnel" required>
              <div className="relative">
                <Input type="email" placeholder="nom@mairie.ci" required disabled={isSubmitting} className="pl-10" />
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Rôle / Fonction" required>
                <Select required disabled={isSubmitting}>
                  <option value="MAIRE">Maire</option>
                  <option value="AGENT_FINANCIER">Agent Financier</option>
                  <option value="DGDDL">DGDDL</option>
                  <option value="BAILLEUR">Bailleur</option>
                </Select>
              </FormField>
              <FormField label="Affectation (Commune)">
                <Input placeholder="Ex: Abidjan" disabled={isSubmitting} />
              </FormField>
            </div>

            <div className="pt-6 border-t border-border flex justify-end space-x-3">
              <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)} disabled={isSubmitting}>Annuler</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Création...
                  </>
                ) : "Enregistrer le compte"}
              </Button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
}

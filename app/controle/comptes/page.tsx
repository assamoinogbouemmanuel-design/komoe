"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Search, ShieldCheck, Building2, Globe } from "lucide-react";

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

  const roles = ["Tous", ...Array.from(new Set(COMPTES_MOCK.map((u) => u.role)))];

  const filtered = COMPTES_MOCK.filter((u) => {
    const matchSearch =
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.prenom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Tous" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Gestion des comptes</h2>
          <p className="text-muted-foreground mt-1 text-sm">Tous les utilisateurs KOMOE — mairies, institutions, société civile</p>
        </div>
        <button className="flex items-center gap-2 bg-[#000040] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#000060] transition">
          + Nouveau compte
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total comptes", value: COMPTES_MOCK.length, icon: Users },
          { label: "Mairies (Maire + Agent)", value: COMPTES_MOCK.filter(u => u.role === "MAIRE" || u.role === "AGENT_FINANCIER").length, icon: Building2 },
          { label: "Institutions", value: COMPTES_MOCK.filter(u => ["DGDDL","COUR_COMPTES","BAILLEUR"].includes(u.role)).length, icon: ShieldCheck },
          { label: "Comptes actifs", value: COMPTES_MOCK.filter(u => u.actif).length, icon: Globe },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <Icon className="w-5 h-5 text-foreground mb-2" />
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000040]"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-[#000040]"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r === "Tous" ? "Tous les rôles" : ROLE_LABELS[r] ?? r}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-foreground" />
            {filtered.length} compte{filtered.length > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Utilisateur</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rôle</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Commune</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{u.prenom} {u.nom}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_COLORS[u.role] ?? "outline"}>
                        {ROLE_LABELS[u.role] ?? u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.commune ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant={u.actif ? "success" : "destructive"}>
                        {u.actif ? "Actif" : "Inactif"}
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
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertTriangle, Send, CheckCircle } from "lucide-react";

const CATEGORIES = ["Dépense suspecte", "Montant anormal", "Transaction sans justificatif", "Retard de publication", "Autre anomalie"];

export default function SignalementPage() {
  const [form, setForm] = useState({ categorie: "", description: "", commune: "", montant: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Signalement envoyé</h3>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          Votre signalement a été transmis à la DGDDL et à la Cour des Comptes. Un numéro de suivi vous sera communiqué sous 48h.
        </p>
        <button
          onClick={() => { setForm({ categorie: "", description: "", commune: "", montant: "" }); setSubmitted(false); }}
          className="mt-2 px-6 py-2 bg-[#000040] text-white rounded-lg text-sm font-semibold hover:bg-[#000060] transition"
        >
          Faire un nouveau signalement
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Signaler une anomalie</h2>
        <p className="text-muted-foreground mt-1 text-sm">Tout citoyen peut signaler une dépense suspecte. Votre signalement est traité par la DGDDL.</p>
      </div>

      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Les signalements sont anonymes et transmis directement à la Direction Générale de la Décentralisation et du Développement Local (DGDDL).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Formulaire de signalement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Catégorie *</label>
              <select
                required
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040] bg-card"
              >
                <option value="">Sélectionner une catégorie…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Commune concernée *</label>
              <input
                required
                type="text"
                placeholder="Ex: Cocody, Yopougon…"
                value={form.commune}
                onChange={(e) => setForm({ ...form, commune: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Montant concerné (optionnel)</label>
              <input
                type="text"
                placeholder="Ex: 45 000 000 FCFA"
                value={form.montant}
                onChange={(e) => setForm({ ...form, montant: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description détaillée *</label>
              <textarea
                required
                rows={5}
                placeholder="Décrivez l'anomalie constatée avec le plus de détails possible…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#000040] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#000060] transition"
            >
              <Send className="w-4 h-4" />
              Envoyer le signalement
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

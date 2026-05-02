"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Select, PdfUpload, RichTextEditor } from "@/components/ui/ReusableForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-context";
import { transactionsApi, type ApiError } from "@/lib/api";

export default function NouvelleTransaction() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "DEPENSE" as "DEPENSE" | "RECETTE",
    montant_fcfa: "",
    categorie: "Infrastructure",
    description: "",
    periode: new Date().toISOString().slice(0, 7),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.commune) { setApiError("Aucune commune associée à votre compte."); return; }
    setLoading(true);
    setApiError(null);
    try {
      await transactionsApi.soumettre({
        commune: user.commune,
        type: form.type,
        montant_fcfa: Number(form.montant_fcfa),
        categorie: form.categorie,
        description: form.description,
        periode: form.periode,
      });
      router.push("/commune/transactions");
    } catch (err) {
      setApiError((err as ApiError)?.message ?? "Erreur lors de la soumission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl h-full bg-background shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 border-l border-border">
        <div className="p-8 pb-32">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tight">Nouvelle Saisie Budgétaire</h2>
              <p className="text-muted-foreground mt-2 font-medium text-sm">Enregistrez une nouvelle dépense de manière immuable sur la blockchain.</p>
            </div>
            <Button variant="ghost" onClick={() => router.back()} className="rounded-full p-2 h-10 w-10 hover:bg-muted">✕</Button>
          </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-lg border-border bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            
            {/* Informations principales de la transaction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Type de transaction" required>
                <Select required value={form.type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm(f => ({ ...f, type: e.target.value as "DEPENSE" | "RECETTE" }))}>
                  <option value="DEPENSE">Dépense (Paiement, Subvention accordée)</option>
                  <option value="RECETTE">Recette (Fonds reçus)</option>
                </Select>
              </FormField>

              <FormField label="Montant (FCFA)" required>
                <Input type="number" placeholder="Ex: 1500000" min="0" required value={form.montant_fcfa} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, montant_fcfa: e.target.value }))} />
              </FormField>
            </div>

            {/* Classification Objectifs de Développement Durable (ODD) et bénéficiaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Catégorie (ODD)" required>
                <Select required value={form.categorie} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm(f => ({ ...f, categorie: e.target.value }))}>
                  <option value="Infrastructure">Infrastructure (ODD 9)</option>
                  <option value="Sante">Santé (ODD 3)</option>
                  <option value="Education">Éducation (ODD 4)</option>
                  <option value="Eau">Eau &amp; Assainissement (ODD 6)</option>
                  <option value="Administration">Administration générale</option>
                  <option value="Agriculture">Agriculture (ODD 2)</option>
                  <option value="Autre">Autre</option>
                </Select>
              </FormField>

              <FormField label="Période (AAAA-MM)" required>
                <Input type="month" required value={form.periode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, periode: e.target.value }))} />
              </FormField>
            </div>

            <FormField label="Description détaillée" required>
              <RichTextEditor name="description" placeholder="Détails des travaux ou de l'allocation..." onChange={(val: string) => setForm(f => ({ ...f, description: val }))} />
            </FormField>

            {/* Preuves / Justificatifs de la transaction (stockés off-chain comme IPFS dans un cas réel) */}
            <FormField label="Documents justificatifs (Optionnel)">
              <PdfUpload name="documents" maxPDFs={2} placeholder="Factures, Bons de commande (PDF)" />
            </FormField>

          </CardContent>
        </Card>

        <div className="fixed bottom-0 right-0 w-full max-w-2xl bg-background/80 backdrop-blur-md border-t border-border p-6 flex flex-col gap-3">
          {apiError && <p className="text-sm font-bold text-red-500 bg-red-900/20 p-3 rounded-xl border border-red-900/30 text-center">{apiError}</p>}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => router.back()} className="font-bold">Annuler</Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-2xl text-base font-black tracking-wide shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5"
              disabled={loading}
              loading={loading}
            >
              {loading ? "Soumission en cours…" : "Soumettre sur Polygon"}
            </Button>
          </div>
        </div>
      </form>
      </div>
      </div>
    </div>
  );
}

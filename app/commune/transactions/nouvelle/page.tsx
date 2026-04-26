"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Select, PdfUpload, RichTextEditor } from "@/components/ui/ReusableForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function NouvelleTransaction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Gère la soumission du formulaire et simule l'enregistrement blockchain
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation du temps de réponse d'un enregistrement sur le réseau Ethereum/Sepolia
    setTimeout(() => {
      setLoading(false);
      // Redirection vers l'historique après succès
      router.push("/commune/transactions");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
        <div className="p-8 pb-32">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nouvelle Saisie Budgétaire</h2>
              <p className="text-slate-500 mt-1 font-medium text-sm">Enregistrez une nouvelle dépense de manière immuable sur la blockchain.</p>
            </div>
            <Button variant="ghost" onClick={() => router.back()} className="rounded-full p-2 h-10 w-10">✕</Button>
          </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm border-slate-100 rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            
            {/* Informations principales de la transaction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Type de transaction" required>
                <Select required>
                  <option value="DEPENSE">Dépense (Paiement, Subvention accordée)</option>
                  <option value="RECETTE">Recette (Fonds reçus)</option>
                </Select>
              </FormField>

              <FormField label="Montant (FCFA)" required>
                <Input type="number" placeholder="Ex: 1500000" min="0" required />
              </FormField>
            </div>

            {/* Classification Objectifs de Développement Durable (ODD) et bénéficiaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Catégorie (ODD)" required>
                <Select required>
                  <option value="Infrastructure">Infrastructure (ODD 9)</option>
                  <option value="Santé">Santé (ODD 3)</option>
                  <option value="Éducation">Éducation (ODD 4)</option>
                  <option value="Eau">Eau & Assainissement (ODD 6)</option>
                </Select>
              </FormField>

              <FormField label="Bénéficiaire" required>
                <Input placeholder="Nom de l'entreprise ou institution" required />
              </FormField>
            </div>

            {/* Description enrichie grâce au composant ReusableForm */}
            <FormField label="Description détaillée" required>
              <RichTextEditor name="description" placeholder="Détails des travaux ou de l'allocation..." />
            </FormField>

            {/* Preuves / Justificatifs de la transaction (stockés off-chain comme IPFS dans un cas réel) */}
            <FormField label="Documents justificatifs (Optionnel)">
              <PdfUpload name="documents" maxPDFs={2} placeholder="Factures, Bons de commande (PDF)" />
            </FormField>

          </CardContent>
        </Card>

        {/* Actions de validation avec signature simulant MetaMask */}
        <div className="fixed bottom-0 right-0 w-full max-w-2xl bg-white border-t border-slate-100 p-6 flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
          <Button 
            type="submit" 
            className="bg-brand-orange hover:bg-[#b05020] text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-brand-orange/30"
            disabled={loading}
          >
            {loading ? "Signature MetaMask..." : "Signer et Enregistrer"}
          </Button>
        </div>
      </form>
      </div>
      </div>
    </div>
  );
}

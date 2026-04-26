"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ExternalLink, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DocumentPreview } from "@/components/ui/DocumentPreview";

export default function FinanceTransactionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <Link href="/finance/transactions" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-brand-blue mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour à l'Audit
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Audit de Liquidité</h2>
            <Badge variant="success">Vérifié</Badge>
          </div>
          <p className="text-slate-500 font-mono text-sm">ID: {id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2 shadow-sm border-slate-100 rounded-3xl">
          <CardContent className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Détails de l'Audit</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Entité Auditée</p>
                <p className="font-medium text-slate-900">Mairie de Cocody</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                <p className="font-medium text-slate-700">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Conclusion</p>
                <p className="font-medium text-slate-700">Toutes les transactions du mois correspondent aux réserves déclarées. Aucun écart constaté.</p>
              </div>
              <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hash de l'Audit</p>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-sm text-slate-600 break-all">
                  0x8f2a9c4b123d9e87f54c987a0b345e678f2a9c4b123d9e87f54c987a0b345e67
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100 rounded-3xl bg-slate-50">
          <CardContent className="p-6">
            <h3 className="text-md font-bold text-slate-900 mb-4">Rapports d'Audit Associés</h3>
            <div className="space-y-3">
              <DocumentPreview fileName="Rapport_Audit_Q1_2026.pdf" fileSize="4.2 MB" type="pdf" onDownload={() => alert('Téléchargement démarré')} />
              <DocumentPreview fileName="Annexe_Releves_Bancaires.pdf" fileSize="1.8 MB" type="pdf" onDownload={() => alert('Téléchargement démarré')} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

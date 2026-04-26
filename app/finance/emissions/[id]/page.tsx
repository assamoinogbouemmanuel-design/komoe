"use client";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EmissionDetailPage() {
  const params = useParams();
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <Link href="/finance/emissions" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-brand-blue mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux émissions
      </Link>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Émission Monétaire: {params.id}</h2>
        <Badge variant="success" className="mt-2">Actif Circulant</Badge>
      </div>
      <Card>
        <CardContent className="p-8">
          <p className="text-slate-600">Détails de l'injection de liquidité sur la blockchain.</p>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl font-mono text-sm break-all border border-slate-200">
            Smart Contract Hash: 0x908123...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

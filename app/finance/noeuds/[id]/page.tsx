"use client";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowLeft, Server } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NoeudDetailPage() {
  const params = useParams();
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <Link href="/finance/noeuds" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-brand-blue mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux nœuds
      </Link>
      <div className="mb-8 flex items-center gap-4">
        <div className="p-4 bg-brand-blue rounded-2xl text-white shadow-lg"><Server size={32} /></div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Nœud Validateur {params.id}</h2>
          <Badge variant="success" className="mt-2">En Ligne</Badge>
        </div>
      </div>
      <Card>
        <CardContent className="p-8">
          <p className="text-slate-600">Métriques de disponibilité et logs d'activité du nœud sur le réseau KOMOE.</p>
        </CardContent>
      </Card>
    </div>
  );
}

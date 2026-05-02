"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowLeft, User, MapPin, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CitoyenDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <Link href="/commune/citoyens" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-brand-blue mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour au registre citoyens
      </Link>

      <Card className="shadow-sm border-border rounded-3xl overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-brand-blue to-brand-orange/50"></div>
        <CardContent className="p-8 relative">
          <div className="absolute -top-12 left-8 w-24 h-24 bg-card rounded-2xl shadow-md flex items-center justify-center text-4xl font-bold text-brand-blue">
            <User size={48} />
          </div>
          
          <div className="mt-12 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Kouadio Jean</h2>
              <p className="text-muted-foreground font-medium text-sm flex items-center gap-2 mt-2">
                <MapPin size={16} /> Riviera 2, Cocody
              </p>
            </div>
            <Badge variant="success" className="text-sm px-3 py-1">Identité Vérifiée (KYC)</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 p-6 bg-muted rounded-2xl">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Téléphone</p>
              <p className="font-bold text-foreground mt-1">+225 0700112233</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</p>
              <p className="font-bold text-foreground mt-1">jean.k@email.ci</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date d'inscription</p>
              <p className="font-bold text-foreground mt-1">15 Janvier 2026</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Signalements émis</p>
              <p className="font-bold text-foreground mt-1">3</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold text-foreground mb-4">Historique des intéractions</h3>
      <div className="space-y-4">
        <div className="flex gap-4 items-start p-4 bg-card border border-border rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><CheckCircle size={20} /></div>
          <div>
            <p className="font-bold text-foreground">A voté pour le projet "Rénovation École Primaire"</p>
            <p className="text-xs text-muted-foreground mt-1">Le 20 Mars 2026</p>
          </div>
        </div>
        <div className="flex gap-4 items-start p-4 bg-card border border-border rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Clock size={20} /></div>
          <div>
            <p className="font-bold text-foreground">A signalé "Nid de poule dangereux"</p>
            <p className="text-xs text-muted-foreground mt-1">Le 18 Février 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

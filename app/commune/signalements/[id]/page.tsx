"use client";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowLeft, AlertTriangle, MapPin, Calendar, Users, Camera } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SignalementDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <Link href="/commune/signalements" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-brand-blue mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux signalements
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Nid de poule dangereux ({id})</h2>
            <Badge variant="secondary">En cours</Badge>
          </div>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1"><MapPin size={16} /> Riviera Palmeraie</span>
            <span className="flex items-center gap-1"><Calendar size={16} /> Signalé le 20 Avr 2026</span>
          </p>
        </div>
        <div className="flex flex-col items-center p-3 bg-brand-orange/10 rounded-2xl">
          <span className="text-2xl font-black text-brand-orange">45</span>
          <span className="text-xs font-bold text-brand-orange/70 uppercase">Soutiens</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-100 rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Description</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Un nid de poule très profond s'est formé au niveau du carrefour de la pharmacie. 
              Plusieurs véhicules ont déjà été endommagés. Risque d'accident grave la nuit car l'éclairage public est faible à cet endroit.
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Citoyen Signalant</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><Users size={18} /></div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Kouadio Jean</p>
                  <p className="text-xs text-slate-500">Compte vérifié</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100 rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Photos jointes</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                <Camera className="text-slate-300" size={32} />
              </div>
              <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                <Camera className="text-slate-300" size={32} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

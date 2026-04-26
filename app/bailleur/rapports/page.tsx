"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { FileText, Download } from "lucide-react";

export default function RapportsBailleur() {
  const rapports = [
    { id: 1, titre: "Rapport d'exécution T1 2026", date: "2026-04-01", type: "Trimestriel" },
    { id: 2, titre: "Audit Financier Annuel 2025", date: "2026-01-15", type: "Audit" },
    { id: 3, titre: "Impact Infrastructure Cocody", date: "2026-03-10", type: "Impact" }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rapports & Exports</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Générez et téléchargez les rapports certifiés par la blockchain.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rapports.map(rapport => (
          <Card key={rapport.id} className="shadow-sm border-slate-100 rounded-2xl group hover:border-brand-blue/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{rapport.titre}</h4>
                  <p className="text-xs text-slate-500">Généré le {new Date(rapport.date).toLocaleDateString()} • Type: {rapport.type}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-brand-orange p-2">
                <Download size={20} />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

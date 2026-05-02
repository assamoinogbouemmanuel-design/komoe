"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Users, Building, Activity } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCommuneDetail } from "@/lib/hooks/useCommunes";

export default function ProfilCommune() {
  const { user } = useAuth();
  const { commune } = useCommuneDetail(user?.commune ?? null);
  if (!commune) return null;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Profil de la Commune</h2>
        <p className="text-muted-foreground mt-1 font-medium text-sm">Vue d'ensemble et cartographie des projets en cours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2 shadow-sm border-border rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/50 border-b border-border pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-brand-blue text-white rounded-2xl flex items-center justify-center font-bold text-2xl">
                  {commune.nom.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">{commune.nom}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{commune.region}</p>
                </div>
              </div>
              <Badge variant="success">Compte Certifié</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-2xl">
                <Users className="text-brand-orange" />
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">Population</p>
                  <p className="text-lg font-bold text-foreground">Score : {commune.score_transparence}/100</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-2xl">
                <Building className="text-brand-orange" />
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">Superficie</p>
                  <p className="text-lg font-bold text-foreground">{commune.region}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-2xl">
                <Activity className="text-brand-orange" />
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">Maire</p>
                  <p className="text-lg font-bold text-foreground">{commune.maire_nom || "Non défini"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-2xl">
                <MapPin className="text-brand-orange" />
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">Coordonnées</p>
                  <p className="text-sm font-bold text-foreground">5.3599° N, 4.0083° W</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border rounded-3xl overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Cartographie (Map)</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative bg-muted/50 min-h-[250px]">
            {/* Simulation d'une carte interactive */}
            <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/13/4011/3956.png')] bg-cover bg-center opacity-60 mix-blend-multiply"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-card/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg text-center animate-bounce">
                <MapPin className="mx-auto text-brand-orange mb-2" size={32} />
                <p className="font-bold text-foreground text-sm">Secteur {commune.nom}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

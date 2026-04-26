import Link from 'next/link';
import { Building2, Landmark, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-green-900 mb-4 tracking-tight">KOMOE</h1>
        <p className="text-gray-600 text-lg">Transparence Budgétaire sur Blockchain</p>
      </div>

      <div className="max-w-4xl w-full">
        <h2 className="text-xl font-semibold text-center mb-8 text-gray-800">Sélectionnez votre profil (Démo Mockée)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/commune/dashboard" className="group">
            <Card className="h-full border-2 border-transparent group-hover:border-green-500 transition-all cursor-pointer">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Commune / Mairie</h3>
                <p className="text-sm text-gray-500">Gérez le budget, déclarez les dépenses et vérifiez les fonds alloués.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/bailleur/dashboard" className="group">
            <Card className="h-full border-2 border-transparent group-hover:border-blue-500 transition-all cursor-pointer">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bailleur de Fonds</h3>
                <p className="text-sm text-gray-500">Suivez l'utilisation de vos fonds par commune et analysez les rapports.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/finance/dashboard" className="group">
            <Card className="h-full border-2 border-transparent group-hover:border-purple-500 transition-all cursor-pointer">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Landmark className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Institution Financière</h3>
                <p className="text-sm text-gray-500">Supervisez la liquidité globale, consultez les audits et la conformité.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

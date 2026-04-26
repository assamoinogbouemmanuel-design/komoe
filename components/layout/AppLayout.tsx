import { Role } from '@/types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  role: Role;
}

// Structure de base de l'application englobant toutes les pages
export const AppLayout = ({ children, role }: AppLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Barre de navigation latérale adaptée au rôle */}
      <Sidebar role={role} />
      
      {/* Conteneur principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* En-tête supérieur adapté au rôle */}
        <Header role={role} />
        
        {/* Zone de contenu des pages avec scroll automatique */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

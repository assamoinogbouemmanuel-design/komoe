"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/types';
import { Building2, LayoutDashboard, Receipt, FileText, Landmark, ShieldCheck, PieChart, AlertTriangle, Users, Shield, Network, ArrowDownRight, Server } from 'lucide-react';

interface SidebarProps {
  role: Role;
}

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();

  const getNavItems = () => {
    switch (role) {
      case 'COMMUNE':
        return [
          { name: 'Tableau de bord', href: '/commune/dashboard', icon: LayoutDashboard },
          { name: 'Budget', href: '/commune/budget', icon: PieChart },
          { name: 'Dépenses', href: '/commune/depenses', icon: ArrowDownRight },
          { name: 'Transactions', href: '/commune/transactions', icon: Receipt },
          { name: 'Citoyens', href: '/commune/citoyens', icon: Users },
          { name: 'Signalements', href: '/commune/signalements', icon: AlertTriangle },
          { name: 'Rôles & Accès', href: '/commune/roles', icon: Shield },
          { name: 'Réseau Blockchain', href: '/commune/blockchain', icon: Network },
          { name: 'Mon Profil', href: '/commune/profil', icon: Building2 },
        ];
      case 'BAILLEUR':
        return [
          { name: 'Vue globale', href: '/bailleur/dashboard', icon: LayoutDashboard },
          { name: 'Projets Financés', href: '/bailleur/projets', icon: Building2 },
          { name: 'Communes', href: '/bailleur/communes', icon: Users },
          { name: 'Réseau Blockchain', href: '/bailleur/blockchain', icon: Network },
          { name: 'Rapports & Audits', href: '/bailleur/rapports', icon: FileText },
        ];
      case 'FINANCE':
        return [
          { name: 'Supervision', href: '/finance/dashboard', icon: LayoutDashboard },
          { name: 'Émissions Monétaires', href: '/finance/emissions', icon: PieChart },
          { name: 'Audit de Liquidité', href: '/finance/transactions', icon: Landmark },
          { name: 'Nœuds Validateurs', href: '/finance/noeuds', icon: Server },
          { name: 'Réseau Blockchain', href: '/finance/blockchain', icon: Network },
          { name: 'Conformité', href: '/finance/conformite', icon: ShieldCheck },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-brand-blue text-white flex flex-col min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wider text-brand-orange">KOMOE</h1>
        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-white/20">
          {role}
        </span>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-brand-orange text-white shadow-sm font-bold' 
                  : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'opacity-100' : 'opacity-80'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <Link 
          href="/login"
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Déconnexion
        </Link>
      </div>
    </aside>
  );
};

"use client";

import { Role, ROLE_LABELS } from '@/types';
import { Bell, Wallet, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';

interface HeaderProps {
  role: Role;
  onOpenMobile: () => void;
}

const ROLE_HEADER_INFO: Record<Role, { title: string; address: string; network: string }> = {
  AGENT_FINANCIER: { title: 'Agent Financier — Mairie',  address: '0x3f8...e841', network: 'Polygon Amoy' },
  MAIRE:           { title: 'Maire — Commune',            address: '0x1a2...b345', network: 'Polygon Amoy' },
  DGDDL:           { title: 'DGDDL — Ministère',   address: '0x5c6...d789', network: 'Polygon Amoy' },
  COUR_COMPTES:    { title: 'Cour des Comptes',  address: '0x8e9...0abc', network: 'Polygon Amoy' },
  BAILLEUR:        { title: 'Banque Mondiale',        address: '0x2b3...c456', network: 'Polygon Amoy' },
  CITOYEN:         { title: 'Citoyen',                    address: '—',            network: 'Polygon Amoy' },
  JOURNALISTE:     { title: 'Presse / ONG',       address: '—',            network: 'Polygon Amoy' },
};

export const Header = ({ role, onOpenMobile }: HeaderProps) => {
  const info = ROLE_HEADER_INFO[role] ?? { title: 'Utilisateur', address: '0x000...0000', network: 'Polygon Amoy' };
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden text-foreground" onClick={onOpenMobile}>
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            KOMOE
          </span>
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span className="text-sm font-semibold text-muted-foreground">{ROLE_LABELS[role]}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:bg-muted/50 rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Changer le thème</span>
        </Button>

        <Button variant="ghost" size="icon" className="text-muted-foreground relative hover:bg-muted/50 rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full ring-2 ring-background"></span>
        </Button>

        <div className="h-6 w-px bg-border hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-foreground truncate max-w-[160px]">{info.title}</p>
            <div className="flex items-center justify-end gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-xs font-semibold text-purple-600">{info.network}</span>
            </div>
          </div>
          {info.address !== '—' && (
            <div className="bg-muted hover:bg-border transition-colors cursor-pointer rounded-full flex items-center px-3 py-1.5 border border-border">
              <Wallet className="w-4 h-4 text-purple-500 mr-2 shrink-0" />
              <span className="text-sm font-semibold text-foreground font-mono">{info.address}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

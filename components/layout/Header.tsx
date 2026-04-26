import { Role } from '@/types';
import { Bell, Search, Wallet } from 'lucide-react';

interface HeaderProps {
  role: Role;
}

export const Header = ({ role }: HeaderProps) => {
  const getHeaderInfo = () => {
    switch (role) {
      case 'COMMUNE': return { title: 'Mairie de Cocody', address: '0x3f8...e841' };
      case 'BAILLEUR': return { title: 'Banque Mondiale', address: '0x1a2...b345' };
      case 'FINANCE': return { title: 'Superviseur BCEAO', address: '0x99f...001a' };
      default: return { title: 'Utilisateur', address: '0x000...0000' };
    }
  };

  const info = getHeaderInfo();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        {/* <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher une transaction..." 
            className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all w-64 text-slate-700 placeholder:text-slate-400"
          />
        </div> */}
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center">
          <div className="mr-3 text-right">
            <p className="text-sm font-semibold text-gray-900">{info.title}</p>
            <div className="flex items-center text-xs text-gray-500 justify-end">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              Sepolia
            </div>
          </div>
          <div className="bg-gray-100 rounded-full flex items-center px-3 py-1.5 border border-gray-200">
            <Wallet className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">{info.address}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

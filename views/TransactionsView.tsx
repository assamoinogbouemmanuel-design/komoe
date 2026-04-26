"use client";

import { Role } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Filter, FileText } from 'lucide-react';
import Link from 'next/link';
import DataTable, { ColumnConfig } from '@/components/ui/DataTable';
import { Drawer } from '@/components/ui/Drawer';
import { useState } from 'react';
import transactionsData from '@/mock/transactions.json';

interface TransactionsViewProps {
  role: Role;
}

export const TransactionsView = ({ role }: TransactionsViewProps) => {
  // Formatage du montant en devise locale (FCFA)
  const formatXOF = (amount: number) => {
    return new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  // Filtrer les transactions en fonction du rôle connecté
  const getFilteredTransactions = () => {
    // La commune ne voit que ses propres transactions (et pas les audits système)
    if (role === 'COMMUNE') return transactionsData.filter(t => t.communeId === 'COM-001' && t.type !== 'AUDIT_LIQUIDITE');
    // La finance a une vue globale, incluant les audits de liquidité
    if (role === 'FINANCE') return transactionsData; 
    // Par défaut (Bailleur), on affiche tout pour la démo
    return transactionsData; 
  };

  const txs = getFilteredTransactions();

  const columns: ColumnConfig<any>[] = [
    {
      header: 'Type',
      key: 'type',
      render: (val) => (
        <Badge variant={val === 'DEPENSE' ? 'destructive' : val === 'RECETTE' ? 'success' : 'secondary'}>
          {val}
        </Badge>
      ),
    },
    {
      header: 'Description',
      key: 'description',
      render: (val, item) => (
        <div>
          <div className="font-medium text-gray-900">{val}</div>
          <div className="text-xs text-gray-500 font-normal mt-0.5">Catégorie: {item.categorie}</div>
        </div>
      ),
    },
    {
      header: 'Montant',
      key: 'montant',
      render: (val) => (
        <span className="font-semibold text-slate-800">
          {val > 0 ? formatXOF(val) : '-'}
        </span>
      ),
    },
    {
      header: 'Date',
      key: 'date',
      render: (val) => <span className="text-slate-600">{new Date(val).toLocaleDateString()}</span>,
    },
    {
      header: 'Hash',
      key: 'txHash',
      render: (val) => (
        <div className="flex items-center text-sm font-mono text-brand-blue bg-blue-50 px-2 py-1 rounded w-fit">
          {val}
          <ExternalLink className="w-3 h-3 ml-1.5" />
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, item) => {
        const route = role === 'COMMUNE' ? 'commune' : role === 'BAILLEUR' ? 'bailleur' : 'finance';
        return (
          <Link href={`/${route}/transactions/${item.id}`}>
            <Button variant="ghost" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Détails
            </Button>
          </Link>
        );
      }
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registre des Transactions</h2>
          <p className="text-gray-500">Consultez l'historique immuable gravé sur la blockchain.</p>
        </div>
        {/* Bouton d'action uniquement visible par les mairies pour ajouter de nouvelles entrées */}
        {role === 'COMMUNE' && (
          <Link href="/commune/transactions/nouvelle">
            <Button className="bg-brand-orange hover:bg-[#b05020] text-white shadow-md">
              + Nouvelle Saisie
            </Button>
          </Link>
        )}
      </div>

      {/* Remplacement du vieux tableau par le DataTable stylisé */}
      <DataTable 
        title="Historique des Flux" 
        columns={columns} 
        data={txs} 
      />
    </div>
  );
};

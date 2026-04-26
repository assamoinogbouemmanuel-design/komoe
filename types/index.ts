export type Role = 'COMMUNE' | 'BAILLEUR' | 'FINANCE';

export interface Commune {
  id: string;
  nom: string;
  region: string;
  district: string;
  budgetAlloue: number;
  budgetDepense: number;
  coordonnees: { lat: number; lng: number };
}

export interface Bailleur {
  id: string;
  nom: string;
  type: string;
  fondsAlloues: number;
  communesSoutenues: string[];
}

export interface InstitutionFinanciere {
  id: string;
  nom: string;
  type: string; // ex: 'Banque Centrale', 'Banque Commerciale'
  niveauLiquidite: number;
  auditsRealises: number;
  scoreConformite: number; // sur 100
}

export type TransactionType = 'DEPENSE' | 'RECETTE' | 'AUDIT_LIQUIDITE';

export interface Transaction {
  id: string;
  type: TransactionType;
  montant: number;
  categorie: string;
  beneficiaire: string;
  communeId: string;
  bailleurId?: string;
  institutionId?: string;
  description: string;
  date: string; // ISO String
  txHash: string; // Mocked hash
  status: 'CONFIRME' | 'EN_ATTENTE' | 'ECHOUE';
}

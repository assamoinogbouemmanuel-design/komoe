# KOMOE — Transparence Budgétaire sur Blockchain

> **MIABE Hackathon 2026 · Projet CI-01 · D08**
> _La Blockchain au service de la transparence budgétaire_
> _Comment KOMOE rend chaque franc communal immuable, public et vérifiable — en temps réel._

---

## Table des matières

1. [Vision du projet](#1-vision-du-projet)
2. [Problème résolu](#2-problème-résolu)
3. [Stack technique](#3-stack-technique)
4. [Architecture globale](#4-architecture-globale)
5. [Arborescence complète du projet](#5-arborescence-complète-du-projet)
6. [Description détaillée de chaque fichier et dossier](#6-description-détaillée-de-chaque-fichier-et-dossier)
7. [Smart Contract BudgetLedger.sol](#7-smart-contract-budgetledgersol)
8. [Configuration des environnements](#8-configuration-des-environnements)
9. [Données mockées (phase 1)](#9-données-mockées-phase-1)
10. [Flux complet d'une transaction](#10-flux-complet-dune-transaction)
11. [Roadmap des phases](#11-roadmap-des-phases)
12. [Installation et lancement](#12-installation-et-lancement)
13. [Conventions de code](#13-conventions-de-code)
14. [Contributeurs](#14-contributeurs)

---

## 1. Vision du projet

KOMOE est une **plateforme d'administration budgétaire communale** qui enregistre chaque dépense et recette sur la blockchain Ethereum. Elle vise à éliminer l'opacité financière dans les 201 communes ivoiriennes en rendant chaque transaction :

- **Immuable** — cryptographiquement gravée, impossible à modifier ou effacer
- **Publique** — vérifiable par tout citoyen depuis son smartphone, sans inscription
- **Temps réel** — visible en moins de 30 secondes après la saisie
- **Vérifiable** — chaque enregistrement a un hash Keccak-256 vérifiable sur Etherscan

**Cible utilisateurs :**

| Profil | Interface | Rôle |
|--------|-----------|------|
| Agent communal | Web (Next.js) | Saisit les transactions budgétaires |
| Responsable communal | Web (Next.js) | Signe via MetaMask, valide les dépenses |
| Bailleur / Auditeur | Web (Next.js) | Consulte les rapports, vérifie les transactions |
| Citoyen (Aminata) | Mobile (Flutter — Phase 3) | Consulte les dépenses de sa commune |

---

## 2. Problème résolu

| Problème (Excel / PDF) | Solution KOMOE (Blockchain) |
|------------------------|------------------------------|
| Modifiable à volonté par n'importe quel agent | Immuable cryptographiquement (Keccak-256) |
| Aucune preuve d'origine ni d'horodatage | Signature numérique MetaMask + timestamp Unix on-chain |
| Supprimable du serveur communal | Données répliquées sur des milliers de nœuds mondiaux |
| Mise à jour avec 18–24 mois de délai | Visibilité publique en < 30 secondes |
| Moins de 3 % des Ivoiriens y ont accès | Accessible sans intermédiaire, depuis tout smartphone |

---

## 3. Stack technique

### Frontend (Phase 1 — en cours)
| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 14 (App Router) | Framework React SSR/SSG |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 3.x | Styling utilitaire |
| ethers.js | v6 | Interaction blockchain Ethereum |
| MetaMask | Extension navigateur | Wallet, signature des transactions |
| Recharts | 2.x | Graphiques et visualisations |
| Lucide React | latest | Icônes |
| @tanstack/react-query | 5.x | Gestion de l'état serveur / cache |

### Blockchain
| Technologie | Détail |
|-------------|--------|
| Réseau Phase 1–2 | Ethereum Sepolia Testnet (Chain ID : 11155111) |
| Réseau Phase 3 | Ethereum Mainnet + Polygon L2 |
| Langage smart contract | Solidity ^0.8.20 |
| Framework déploiement | Hardhat |
| Indexation events | The Graph Protocol (GraphQL) |

### Backend (Phase 2 — à venir)
| Technologie | Rôle |
|-------------|------|
| Django 5.x | API REST principale |
| Django REST Framework | Sérialisation, endpoints |
| PostgreSQL | Base de données relationnelle |
| Redis | Cache, fallback réseau |
| JWT + MetaMask | Authentification zero-knowledge |

### Phase 1 — Données mockées
En attendant le backend Django, toutes les données sont **simulées localement** via des fichiers JSON et des hooks React dédiés.

---

## 4. Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE 4 — FRONTEND                      │
│         Next.js 14 · TypeScript · Tailwind · ethers.js      │
│   Dashboard Admin · Pages Communes · Rapports · Wallet UI   │
└────────────────────────┬────────────────────────────────────┘
                         │ ethers.js v6
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  COUCHE 3 — BACKEND API                     │
│         Django REST Framework · JWT · Redis Cache           │
│   /api/communes · /api/transactions · /api/stats            │
│          [Phase 1 : données mockées JSON locaux]            │
└────────────────────────┬────────────────────────────────────┘
                         │ Web3 calls
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               COUCHE 2 — INDEXATION                         │
│         The Graph Protocol · Subgraph budget-komoe-ci       │
│   GraphQL : getEntriesByCommune · getTotalsByPeriod         │
└────────────────────────┬────────────────────────────────────┘
                         │ Events on-chain
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             COUCHE 1 — BLOCKCHAIN ETHEREUM                  │
│       Smart Contract BudgetLedger.sol (Solidity ^0.8.20)    │
│   Sepolia Testnet (Phase 1–2) → Mainnet / Polygon (Phase 3) │
│   Events : BudgetEntryRecorded · OwnershipTransferred       │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Arborescence complète du projet

```
komoe-dashboard/
│
├── .env.local                        # Variables d'environnement (non versionné)
├── .env.example                      # Template des variables d'environnement
├── .gitignore                        # Fichiers exclus de Git
├── .eslintrc.json                    # Configuration ESLint
├── next.config.ts                    # Configuration Next.js
├── tailwind.config.ts                # Configuration Tailwind CSS
├── tsconfig.json                     # Configuration TypeScript
├── postcss.config.js                 # Configuration PostCSS
├── package.json                      # Dépendances et scripts npm
├── package-lock.json                 # Lockfile npm
├── README.md                         # Ce fichier
│
├── public/                           # Assets statiques servis publiquement
│   ├── logo-komoe.svg                # Logo KOMOE
│   ├── logo-komoe-white.svg          # Logo KOMOE version blanche (sidebar)
│   ├── favicon.ico                   # Favicon
│   └── images/
│       └── map-cote-divoire.png      # Carte Côte d'Ivoire (Dashboard)
│
├── src/
│   │
│   ├── app/                          # App Router Next.js 16²²²²²²²²²²²²²²²²²²
│   │   ├── layout.tsx                # Layout racine (font, metadata, providers)
│   │   ├── globals.css               # Styles globaux + variables CSS
│   │   ├── page.tsx                  # Page d'accueil → redirect /dashboard
│   │   │
│   │   ├── (auth)/                   # Groupe de routes : authentification
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Page de connexion MetaMask
│   │   │   └── layout.tsx            # Layout auth (centré, sans sidebar)
│   │   │
│   │   ├── (dashboard)/              # Groupe de routes : espace admin connecté
│   │   │   ├── layout.tsx            # Layout dashboard (sidebar + header)
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Vue d'ensemble : KPIs, carte, graphiques
│   │   │   │
│   │   │   ├── transactions/
│   │   │   │   ├── page.tsx          # Liste de toutes les transactions
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Détail d'une transaction (hash, bloc, etc.)
│   │   │   │
│   │   │   ├── communes/
│   │   │   │   ├── page.tsx          # Liste des 201 communes ivoiriennes
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Profil d'une commune (budget, dépenses)
│   │   │   │
│   │   │   ├── budget/
│   │   │   │   ├── page.tsx          # Vue budgétaire par catégorie / période
│   │   │   │   └── categories/
│   │   │   │       └── page.tsx      # Gestion des catégories budgétaires (ODD)
│   │   │   │
│   │   │   ├── rapports/
│   │   │   │   └── page.tsx          # Rapports exportables (PDF, CSV)
│   │   │   │
│   │   │   ├── bailleurs/
│   │   │   │   ├── page.tsx          # Liste des bailleurs de fonds
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Tableau de bord bailleur
│   │   │   │
│   │   │   ├── wallet/
│   │   │   │   └── page.tsx          # Gestion wallet, solde, historique TX
│   │   │   │
│   │   │   └── roles/
│   │   │       └── page.tsx          # Paramètres compte et gestion des roles et utilisateurs
│   │   │   └── profil/
│   │   │       └── page.tsx          # Paramètres compte et commune
│   │   │
│   │   └── api/                      # API Routes Next.js (mock backend Phase 1)
│   │       ├── transactions/
│   │       │   ├── route.ts          # GET /api/transactions · POST /api/transactions
│   │       │   └── [id]/
│   │       │       └── route.ts      # GET /api/transactions/:id
│   │       ├── communes/
│   │       │   ├── route.ts          # GET /api/communes
│   │       │   └── [slug]/
│   │       │       └── route.ts      # GET /api/communes/:slug
│   │       ├── stats/
│   │       │   └── route.ts          # GET /api/stats (KPIs globaux)
│   │       └── bailleurs/
│   │           └── route.ts          # GET /api/bailleurs
│   │
│   ├── components/                   # Composants React réutilisables
│   │   │
│   │   ├── ui/                       # Composants UI de base (design system)
│   │   │   ├── Button.tsx            # Bouton (variantes : primary, ghost, danger)
│   │   │   ├── Badge.tsx             # Badge de statut (confirmé, en attente, etc.)
│   │   │   ├── StatsCard.tsx         # Carte conteneur avec les statistiques
 ├── DataTable.tsx         # Table de données réutilisable
│   │   │   ├── ModalCenter.tsx             # Modale (dialogue de confirmation)
│   │   │   ├── ReusableForm.tsx             # Modale (incluant tous les champs input comme radio n upload-iage descruitpion texterae)
│   │   ├─  ├── form/
│   │   │   ├── Input.tsx             # Champ de saisie stylisé
│   │   │   ├── Select.tsx            # Sélecteur déroulant
│   │   │   ├── Toast.tsx           # Notifications push
│   │   │   ├── DetailsCard.tsx       # Statistiques détaillées
│   │   │   ├── Spinner.tsx           # Indicateur de chargement
│   │   │   ├── Tooltip.tsx           # Info-bulle
│   │   │   ├── Alert.tsx             # Alertes (success, error, warning, info)
│   │   │   └── Skeleton.tsx          # Squelette de chargement (placeholder)
│   │   │
│   │   ├── layout/                   # Composants de structure de page
│   │   │   ├── Sidebar.tsx           # Barre de navigation latérale
│   │   │   ├── Header.tsx            # En-tête global (wallet, notifications)
│   │   │   ├── Footer.tsx            # Pied de page
│   │   │   └── PageHeader.tsx        # En-tête de section (titre + breadcrumb)
│   │   │
│   │   ├── wallet/                   # Composants liés au wallet Web3
│   │   │   ├── WalletConnect.tsx     # Bouton connexion / déconnexion MetaMask
│   │   │   ├── WalletInfo.tsx        # Affichage adresse, solde SepoliaETH
│   │   │   ├── WalletBadge.tsx       # Badge compact adresse tronquée
│   │   │   └── NetworkGuard.tsx      # Vérificateur de réseau (force Sepolia)
│   │   │
│   │   ├── blockchain/               # Composants visualisation blockchain
│   │   │   ├── TransactionHash.tsx   # Affichage hash TX cliquable (Etherscan)
│   │   │   ├── BlockNumber.tsx       # Numéro de bloc en temps réel
│   │   │   ├── GasPrice.tsx          # Prix du gas en temps réel
│   │   │   ├── NetworkStatus.tsx     # Statut réseau Sepolia (connecté/déconnecté)
│   │   │   └── ConfirmationBadge.tsx # Badge confirmations (0/12 → confirmé)
│   │   │
│   │   ├── transactions/             # Composants gestion des transactions
│   │   │   ├── TransactionTable.tsx  # Tableau paginé des transactions
│   │   │   ├── TransactionCard.tsx   # Carte résumé d'une transaction
│   │   │   ├── TransactionForm.tsx   # Formulaire saisie nouvelle transaction
│   │   │   ├── TransactionDetail.tsx # Vue détaillée (hash, bloc, signature)
│   │   │   ├── TransactionFilters.tsx # Filtres (date, catégorie, commune, montant)
│   │   │   └── TransactionExport.tsx # Boutons export CSV / PDF
│   │   │
│   │   ├── dashboard/                # Composants spécifiques au dashboard
│   │   │   ├── KpiCard.tsx           # Carte KPI (total, variation, icône)
│   │   │   ├── BudgetChart.tsx       # Graphique dépenses par catégorie (Recharts)
│   │   │   ├── TimelineChart.tsx     # Évolution du budget dans le temps
│   │   │   ├── CommuneMap.tsx        # Carte Côte d'Ivoire géolocalisée
│   │   │   ├── RecentTransactions.tsx # Widget dernières transactions
│   │   │   └── AlertsWidget.tsx      # Alertes budgétaires en temps réel
│   │   │
│   │   ├── communes/                 # Composants gestion des communes
│   │   │   ├── CommuneList.tsx       # Liste des 201 communes avec filtres
│   │   │   ├── CommuneCard.tsx       # Carte résumé d'une commune
│   │   │   └── CommuneProfile.tsx    # Profil complet d'une commune
│   │   │
│   │   └── rapports/                 # Composants rapports et exports
│   │       ├── ReportGenerator.tsx   # Générateur de rapports paramétrable
│   │       └── ExportButton.tsx      # Bouton export (PDF / CSV / Excel)
│   │
│   ├── hooks/                        # Hooks React personnalisés
│   │   ├── useWallet.ts              # État wallet MetaMask (adresse, réseau, solde)
│   │   ├── useBalance.ts             # Solde SepoliaETH en temps réel
│   │   ├── useContract.ts            # Instance du smart contract BudgetLedger
│   │   ├── useTransactions.ts        # Fetch + cache des transactions (mock → API)
│   │   ├── useCommunes.ts            # Fetch des données communes
│   │   ├── useStats.ts               # Fetch des KPIs globaux
│   │   ├── useBlockchain.ts          # Bloc courant, gas price, events listener
│   │   └── useNetworkGuard.ts        # Vérification et switch réseau Sepolia
│   │
│   ├── lib/                          # Utilitaires et configuration
│   │   ├── ethers.ts                 # Config ethers.js (providers, formatters)
│   │   ├── contract.ts               # ABI + adresse BudgetLedger, factory
│   │   ├── api.ts                    # Fonctions fetch vers les API Routes
│   │   ├── formatters.ts             # Formatage montants FCFA, dates, adresses
│   │   ├── validators.ts             # Validation formulaires (Zod schemas)
│   │   ├── constants.ts              # Constantes globales (Chain ID, adresses, etc.)
│   │   └── utils.ts                  # Fonctions utilitaires générales
│   │
│   ├── types/                        # Types TypeScript globaux
│   │   ├── wallet.ts                 # WalletState, NetworkInfo
│   │   ├── transaction.ts            # BudgetTransaction, TransactionStatus
│   │   ├── commune.ts                # Commune, CommuneStats
│   │   ├── budget.ts                 # BudgetCategory, BudgetEntry, ODD
│   │   ├── bailleur.ts               # Bailleur, BailleurReport
│   │   └── global.d.ts               # Déclaration window.ethereum
│   │
│   ├── mock/                         # Données simulées (Phase 1 — sans backend)
│   │   ├── transactions.json         # 50+ transactions budgétaires fictives
│   │   ├── communes.json             # 201 communes ivoiriennes avec métadonnées
│   │   ├── categories.json           # Catégories ODD (Infrastructure, Santé, etc.)
│   │   ├── bailleurs.json            # Bailleurs de fonds (BM, AFD, BAD, etc.)
│   │   └── stats.json                # KPIs pré-calculés pour le dashboard
│   │
│   └── styles/                       # Styles globaux additionnels
│       └── components.css            # Classes CSS custom non couvertes par Tailwind
│
└── contracts/                        # Smart contracts Solidity (Hardhat)
    ├── BudgetLedger.sol              # Contrat principal KOMOE
    ├── artifacts/                    # ABI compilés (généré par Hardhat, non versionné)
    ├── scripts/
    │   ├── deploy.ts                 # Script déploiement Sepolia
    │   └── verify.ts                 # Script vérification Etherscan
    ├── test/
    │   └── BudgetLedger.test.ts      # Tests unitaires Hardhat / Chai
    ├── hardhat.config.ts             # Configuration Hardhat (réseaux, accounts)
    └── package.json                  # Dépendances Hardhat séparées
```

---

## 6. Description détaillée de chaque fichier et dossier

### Racine du projet

| Fichier | Description |
|---------|-------------|
| `.env.local` | Variables secrètes non versionnées : clés API Alchemy, adresse du contrat, Chain ID |
| `.env.example` | Template à copier pour configurer l'environnement. Documenter chaque variable |
| `next.config.ts` | Config Next.js : headers CORS, rewrites vers l'API Django (Phase 2), images externes |
| `tailwind.config.ts` | Extension Tailwind : couleurs KOMOE (vert #1B5E20, or #F9A825), polices, breakpoints |
| `tsconfig.json` | Alias `@/*` → `./src/*`, strict mode activé |

---

### `src/app/` — App Router Next.js

#### `layout.tsx` (racine)
Layout racine de l'application. Responsabilités :
- Chargement des polices Google Fonts (ex : Inter + Space Grotesk)
- Balises `<meta>` et SEO globaux
- Injection des Providers React (QueryClientProvider, WalletProvider)
- Application du thème Tailwind

#### `(auth)/login/page.tsx`
Page d'accueil pour les utilisateurs non connectés.
- Bouton "Connecter MetaMask" centré
- Vérification automatique de la présence de `window.ethereum`
- Redirection vers `/dashboard` après connexion réussie
- Message d'erreur si mauvais réseau (non-Sepolia)

#### `(dashboard)/layout.tsx`
Layout partagé par toutes les pages du dashboard.
- Sidebar de navigation gauche (persistante)
- Header haut (wallet badge, notifications, logo)
- Guard : redirige vers `/login` si wallet non connecté
- Guard : alerte si réseau non-Sepolia

#### `(dashboard)/dashboard/page.tsx`
Page principale du tableau de bord.
- 4 KPI Cards (Budget total, Dépenses, Recettes, Transactions)
- Graphique d'évolution mensuelle (Recharts LineChart)
- Graphique dépenses par catégorie (Recharts PieChart)
- Widget carte Côte d'Ivoire avec communes actives
- Widget dernières transactions (5 dernières)
- Widget alertes budgétaires

#### `(dashboard)/transactions/page.tsx`
Liste paginée de toutes les transactions.
- Filtres : période, catégorie, commune, type (dépense/recette), montant min/max
- Tri : date, montant, statut blockchain
- Export CSV / PDF
- Colonne hash TX → lien Etherscan

#### `(dashboard)/transactions/nouvelle/page.tsx`
Formulaire de saisie d'une nouvelle transaction budgétaire.
- Champs : montant (FCFA), catégorie, bénéficiaire, n° marché, description, commune
- Validation en temps réel (Zod)
- Étape 1 : prévisualisation et confirmation
- Étape 2 : signature MetaMask (`signTransaction`)
- Étape 3 : envoi sur Sepolia + affichage hash TX
- Étape 4 : confirmation (attente 2 blocs)

#### `(dashboard)/transactions/[id]/page.tsx`
Détail complet d'une transaction.
- Toutes les métadonnées : montant, catégorie, bénéficiaire, signataire
- Hash TX avec lien Etherscan → vérification indépendante
- Numéro de bloc, timestamp Unix, statut
- Bouton "Vérifier sur Etherscan"

#### `(dashboard)/communes/page.tsx`
Liste des 201 communes ivoiriennes.
- Filtres : région, district, budget disponible
- Carte géolocalisée cliquable
- Indicateurs par commune : budget alloué / dépensé / restant

#### `(dashboard)/wallet/page.tsx`
Tableau de bord wallet.
- Adresse complète avec bouton copie
- Solde SepoliaETH
- Historique des transactions signées
- Bouton switch réseau (si non-Sepolia)
- Lien vers Sepolia Etherscan

#### `app/api/` — Mock API Routes (Phase 1)
Routes Next.js simulant le backend Django en Phase 1.

| Route | Méthode | Réponse |
|-------|---------|---------|
| `/api/transactions` | GET | Liste paginée depuis `mock/transactions.json` |
| `/api/transactions` | POST | Valide le body, retourne la TX simulée |
| `/api/transactions/:id` | GET | Transaction unique par ID |
| `/api/communes` | GET | 201 communes depuis `mock/communes.json` |
| `/api/communes/:slug` | GET | Profil d'une commune |
| `/api/stats` | GET | KPIs depuis `mock/stats.json` |
| `/api/bailleurs` | GET | Liste des bailleurs |

---

### `src/components/`

#### `ui/` — Design System
Composants atomiques sans logique métier. Stylés avec Tailwind, typés avec TypeScript.
Chaque composant expose des `variants` (ex : `Button` → `primary | ghost | danger | outline`).

#### `wallet/WalletConnect.tsx`
Bouton intelligent d'état :
- État "non connecté" → bouton orange "Connecter MetaMask"
- État "connexion en cours" → spinner + "Connexion..."
- État "mauvais réseau" → alerte rouge + bouton "Passer sur Sepolia"
- État "connecté" → adresse tronquée + bouton "Déconnecter"

#### `wallet/NetworkGuard.tsx`
Composant wrapper qui bloque l'accès à son contenu si le réseau n'est pas Sepolia.
Affiche une modale d'avertissement avec bouton "Changer de réseau" (`wallet_switchEthereumChain`).

#### `blockchain/TransactionHash.tsx`
Affiche un hash TX `0x3f8a...e841` avec :
- Icône copie (presse-papier)
- Lien vers `https://sepolia.etherscan.io/tx/{hash}`
- Tooltip avec hash complet au survol

#### `transactions/TransactionForm.tsx`
Formulaire multi-étapes de saisie de transaction. Étapes :
1. Saisie des données (validation Zod en temps réel)
2. Prévisualisation récapitulative
3. Confirmation MetaMask (déclenche `contract.recordEntry()`)
4. Succès avec hash TX et lien Etherscan

---

### `src/hooks/`

#### `useWallet.ts`
Hook central de gestion du wallet MetaMask.
- État : `address`, `balance`, `chainId`, `isConnected`, `isConnecting`, `error`
- Actions : `connect()`, `disconnect()`
- Listeners : `accountsChanged`, `chainChanged`
- Auto-détection de connexion existante au chargement

#### `useContract.ts`
Retourne une instance du smart contract `BudgetLedger`.
- En lecture seule : utilise `JsonRpcProvider` (Alchemy)
- En écriture : utilise `BrowserProvider` + `Signer` (MetaMask)
- Expose : `recordEntry()`, `getEntry()`, `getByPeriod()`, `getByCategory()`

#### `useBlockchain.ts`
Données blockchain en temps réel.
- Numéro de bloc (mis à jour à chaque nouveau bloc via `provider.on("block")`)
- Prix du gas (`provider.getFeeData()`)
- Cleanup automatique des listeners au démontage

#### `useTransactions.ts`
Gestion des transactions avec React Query.
- Phase 1 : fetch depuis `/api/transactions` (données mockées)
- Phase 2 : fetch depuis l'API Django + events The Graph
- Cache automatique, invalidation après mutation
- Pagination et filtres

---

### `src/lib/`

#### `ethers.ts`
```typescript
// Provider lecture seule (Alchemy Sepolia)
export const getReadProvider = () => new ethers.JsonRpcProvider(SEPOLIA_RPC_URL)

// Provider MetaMask (écriture + signature)
export const getBrowserProvider = () => new ethers.BrowserProvider(window.ethereum)

// Utilitaires
export const formatAddress = (addr: string) => `${addr.slice(0,6)}...${addr.slice(-4)}`
export const formatBalance = (bal: bigint) => parseFloat(ethers.formatEther(bal)).toFixed(4)
export const isSepoliaNetwork = (chainId: number) => chainId === 11155111
```

#### `contract.ts`
ABI complet de `BudgetLedger.sol` et factory d'instance.
```typescript
export const getBudgetLedgerContract = (signerOrProvider) =>
  new ethers.Contract(CONTRACT_ADDRESS, BUDGET_LEDGER_ABI, signerOrProvider)
```

#### `formatters.ts`
```typescript
export const formatFCFA = (amount: number) =>
  new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(amount)

export const formatDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString('fr-CI', { dateStyle: 'long' })
```

#### `constants.ts`
```typescript
export const SEPOLIA_CHAIN_ID = 11155111
export const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
export const ETHERSCAN_BASE_URL = 'https://sepolia.etherscan.io'
export const TOTAL_COMMUNES = 201
```

---

### `src/types/`

#### `transaction.ts`
```typescript
export type TransactionType = 'DEPENSE' | 'RECETTE'
export type TransactionStatus = 'EN_ATTENTE' | 'CONFIRME' | 'ECHOUE'

export interface BudgetTransaction {
  id: string
  type: TransactionType
  montant: number                    // En FCFA
  categorie: BudgetCategory
  beneficiaire: string
  numeroMarche?: string
  description: string
  commune: string
  signataire: string                 // Adresse Ethereum 0x...
  txHash?: string                    // Hash Ethereum (null si non encore on-chain)
  blockNumber?: number
  timestamp: number                  // Unix timestamp
  status: TransactionStatus
}
```

#### `global.d.ts`
```typescript
interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>
    on: (event: string, handler: (...args: any[]) => void) => void
    removeListener: (event: string, handler: (...args: any[]) => void) => void
    isMetaMask?: boolean
  }
}
```

---

### `src/mock/`

#### `transactions.json`
50+ transactions fictives couvrant :
- Communes : Abidjan-Cocody, Yopougon, Bouaké, San-Pédro, etc.
- Catégories : Infrastructure, Santé, Éducation, Agriculture, Eau, Sécurité
- Bénéficiaires : COLAS CI, CHU Cocody, Ministère de l'Éducation, etc.
- Statuts variés : confirmé, en attente, échoué
- Hashes TX fictifs (format `0x...`) pour simuler Etherscan

#### `communes.json`
201 communes ivoiriennes avec :
- Nom, slug, district, région, coordonnées GPS
- Budget alloué (en FCFA), budget dépensé, budget restant
- Nombre de transactions enregistrées

#### `categories.json`
Alignées sur les Objectifs de Développement Durable (ODD) :
```json
[
  { "code": "INFRA", "label": "Infrastructure", "odd": "ODD 9", "couleur": "#FF6B35" },
  { "code": "SANTE", "label": "Santé", "odd": "ODD 3", "couleur": "#E63946" },
  { "code": "EDU",   "label": "Éducation", "odd": "ODD 4", "couleur": "#457B9D" },
  { "code": "EAU",   "label": "Eau & Assainissement", "odd": "ODD 6", "couleur": "#1D9E75" }
]
```

---

### `contracts/BudgetLedger.sol`

Voir section dédiée ci-dessous (§7).

---

## 7. Smart Contract BudgetLedger.sol

Déployé sur **Ethereum Sepolia Testnet** (Phase 1–2), puis **Mainnet / Polygon L2** (Phase 3).

### Fonctions principales

| Fonction | Visibilité | Description |
|----------|------------|-------------|
| `recordEntry(montant, categorie, beneficiaire, commune, txType)` | `external onlyOwner` | Enregistre une transaction. Émet `BudgetEntryRecorded`. |
| `getEntry(id)` | `external view` | Retourne la struct `BudgetEntry` immuable. |
| `verifyEntry(hash)` | `external view` | Vérifie un hash et retourne ses métadonnées. |
| `getByPeriod(start, end)` | `external view` | Filtre les entrées sur une plage de timestamps Unix. |
| `getByCategory(categorieCode)` | `external view` | Agrège les dépenses par catégorie ODD. |
| `transferOwnership(newOwner)` | `external onlyOwner` | Changement de signataire autorisé (fin de mandat). |
| `pauseContract()` | `external onlyMultiSig` | Circuit breaker d'urgence (décision multi-signature). |

### Events émis

```solidity
event BudgetEntryRecorded(
    uint256 indexed id,
    address indexed signer,
    uint256 montant,
    bytes32 categorieHash,
    uint256 timestamp
);

event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
event ContractPaused(address indexed triggeredBy, uint256 timestamp);
```

### Propriétés de sécurité

- **Immuabilité** : code non modifiable après déploiement
- **Contrôle d'accès** : seul le `owner` (wallet communal) peut appeler `recordEntry()`
- **Résistance aux collisions** : Keccak-256 (256 bits)
- **Attack résistance** : nécessiterait > 51% du staking Ethereum (~350 Mds USD)
- **Circuit breaker** : `pauseContract()` requiert une décision multi-signature

---

## 8. Configuration des environnements

### `.env.local` (à créer, jamais versionné)

```env
# ─── Réseau Ethereum ───────────────────────────────────────────
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/VOTRE_CLE_ALCHEMY
NEXT_PUBLIC_ALCHEMY_API_KEY=VOTRE_CLE_ALCHEMY

# ─── Smart Contract ────────────────────────────────────────────
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...ADRESSE_DEPLOYEE_SUR_SEPOLIA

# ─── Explorateur blockchain ────────────────────────────────────
NEXT_PUBLIC_ETHERSCAN_URL=https://sepolia.etherscan.io

# ─── API Backend (Phase 2 — Django) ───────────────────────────
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# En production :
# NEXT_PUBLIC_API_BASE_URL=https://api.komoe.ci

# ─── The Graph (Phase 2) ───────────────────────────────────────
NEXT_PUBLIC_GRAPH_URL=https://api.thegraph.com/subgraphs/name/komoe/budget-komoe-ci

# ─── Feature flags ────────────────────────────────────────────
NEXT_PUBLIC_USE_MOCK_DATA=true        # true = Phase 1, false = API réelle
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true   # true = interactions on-chain activées
```

### `.env.example` (versionné)

Copie de `.env.local` avec toutes les valeurs remplacées par des placeholders explicites.

---

## 9. Données mockées (Phase 1)

En Phase 1, aucun backend Django n'est nécessaire. Les données sont servies par :

1. **API Routes Next.js** (`src/app/api/`) qui lisent les fichiers JSON dans `src/mock/`
2. **React Query** pour le cache et la synchronisation côté client
3. **Variable d'environnement** `NEXT_PUBLIC_USE_MOCK_DATA=true` pour activer/désactiver

Quand le backend Django sera prêt (Phase 2) :
- Passer `NEXT_PUBLIC_USE_MOCK_DATA=false`
- Pointer `NEXT_PUBLIC_API_BASE_URL` vers l'API Django
- Les hooks `useTransactions`, `useCommunes`, etc. basculeront automatiquement

---

## 10. Flux complet d'une transaction

```
① Agent communal saisit la transaction (TransactionForm.tsx)
   → Montant : 45 000 000 FCFA
   → Catégorie : Infrastructure
   → Bénéficiaire : COLAS CI SA
   → Marché : MP-2026-CI-0089

② Validation Zod côté client (validators.ts)
   → Tous les champs obligatoires présents
   → Montant > 0 et ≤ budget disponible

③ Responsable clique "Signer et enregistrer"
   → MetaMask popup s'ouvre
   → Responsable approuve la transaction
   → ethers.js envoie la TX sur Sepolia

④ Smart contract BudgetLedger.sol
   → recordEntry() exécuté
   → BudgetEntryRecorded event émis
   → Hash Keccak-256 calculé et stocké

⑤ Confirmation réseau (~12 secondes)
   → TX incluse dans un bloc
   → Bloc confirmé par les validateurs Ethereum

⑥ Indexation The Graph (Phase 2)
   → Subgraph détecte BudgetEntryRecorded
   → Mise à jour GraphQL en temps réel

⑦ Visibilité publique
   → Transaction visible sur app KOMOE
   → Vérifiable sur sepolia.etherscan.io
   → Aminata (citoyenne, Yopougon) peut vérifier le hash
```

---

## 11. Roadmap des phases

### Phase 1 — Frontend + Blockchain Mock (En cours)
- [x] Configuration MetaMask + Sepolia
- [ ] Dashboard admin Next.js complet
- [ ] Données mockées (50+ transactions, 201 communes)
- [ ] Intégration ethers.js + lecture smart contract
- [ ] Smart contract BudgetLedger.sol déployé sur Sepolia
- [ ] Formulaire saisie transaction avec signature MetaMask
- [ ] Vérification Etherscan

### Phase 2 — Backend Django
- [ ] API REST Django (endpoints communes, transactions, stats)
- [ ] Authentification JWT + MetaMask
- [ ] Base de données PostgreSQL
- [ ] Cache Redis
- [ ] Intégration The Graph (indexation events)
- [ ] Remplacement données mockées par API réelle

### Phase 3 — Production
- [ ] Déploiement Mainnet Ethereum / Polygon L2
- [ ] Application mobile Flutter (citoyens)
- [ ] Dashboard public citoyen (201 communes)
- [ ] Intégration Google Maps API
- [ ] Couverture 3G optimisée (< 200 Ko/session)
- [ ] Audit de sécurité smart contract

---

## 12. Installation et lancement

### Prérequis

- Node.js v18+
- npm v9+
- MetaMask installé sur Chrome/Firefox
- Compte Alchemy (pour le RPC Sepolia)
- Réseau Sepolia configuré dans MetaMask (Chain ID : 11155111)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/darollo-tech/komoe-dashboard.git
cd komoe-dashboard

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec tes clés Alchemy et l'adresse du contrat
```

### Lancement en développement

```bash
npm run dev
# → http://localhost:3000
```

### Build de production

```bash
npm run build
npm run start
```

### Déploiement du smart contract (Sepolia)

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
# → Copier l'adresse affichée dans NEXT_PUBLIC_CONTRACT_ADDRESS
```

### Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement Next.js |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint sur tout le code |
| `npm run type-check` | Vérification TypeScript |

---

## 13. Conventions de code

### Nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Composants React | PascalCase | `TransactionCard.tsx` |
| Hooks | camelCase avec `use` | `useWallet.ts` |
| Types | PascalCase | `BudgetTransaction` |
| Constantes | SCREAMING_SNAKE_CASE | `SEPOLIA_CHAIN_ID` |
| Fichiers utilitaires | camelCase | `formatters.ts` |
| Routes (dossiers) | kebab-case | `nouvelle-transaction/` |

### Structure d'un composant

```typescript
// 1. Imports externes
import { useState } from "react"
import { ethers } from "ethers"

// 2. Imports internes (par ordre : types, hooks, lib, composants)
import type { BudgetTransaction } from "@/types/transaction"
import { useWallet } from "@/hooks/useWallet"
import { formatFCFA } from "@/lib/formatters"
import { Badge } from "@/components/ui/Badge"

// 3. Types du composant
interface TransactionCardProps {
  transaction: BudgetTransaction
  onSelect?: (id: string) => void
}

// 4. Composant (export nommé préféré à export default)
export const TransactionCard = ({ transaction, onSelect }: TransactionCardProps) => {
  // ...
}
```

### Commits Git

```
feat: ajouter formulaire saisie transaction
fix: corriger validation montant FCFA négatif
chore: mettre à jour dépendances ethers v6
docs: mettre à jour README arborescence
```

---

## 14. Contributeurs

| Rôle | Nom |
|------|-----|
| Lead Dev Frontend | Darollo Technologies Corporation |
| Smart Contract | Darollo Technologies Corporation |
| Design & UX | Darollo Technologies Corporation |

**MIABE Hackathon 2026 · Projet CI-01 · D08**
Site : [www.miabehackathon.com](https://www.miabehackathon.com)

---

> _"Chaque entrée et sortie financière enregistrée sur blockchain est permanente et publique._
> _Personne — pas même le maire — ne peut modifier ou effacer un enregistrement._
> _La comptabilité devient un registre public vérifiable par tous en temps réel."_
>
> — **KOMOE**, Transparence Budgétaire, Côte d'Ivoire 🇨🇮
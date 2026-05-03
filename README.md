# 🏛️ KOMOE — BudgetOuvert

### Plateforme de Transparence Budgétaire Municipale sur Blockchain
> **Hackathon MIABE 2026 | Darollo Technologies Corporation**  
> Thématique : **D08 — Gouvernance locale & Transparence budgétaire**

---

## 🎯 Présentation de la Solution

**KOMOE / BudgetOuvert** permet aux 201 communes ivoiriennes d'enregistrer leurs recettes et leurs dépenses sur un **registre blockchain public et immuable** (Polygon), accessible en temps réel à chaque citoyen.

La plateforme permet :
1. **Aux Mairies** : Saisir les dépenses, les soumettre, et les valider on-chain.
2. **Aux Organismes de Contrôle (DGDDL, Cour des Comptes)** : Auditer la gestion des communes, consulter les preuves d'enregistrements blockchain, exporter les données.
3. **Au Grand Public** : Suivre l'utilisation du budget primitif et vérifier chaque transaction de manière décentralisée.

---

## 🛠️ Stack Technique

- **Backend API** : Django REST Framework 5.1.4, Python 3.11
- **Base de données** : PostgreSQL 15+ (avec repli automatique intelligent sur SQLite3 pour un développement local ultra résilient)
- **Frontend** : Next.js 15+ (App Router), React 19+, TypeScript, Tailwind CSS
- **Smart Contracts** : Solidity + Hardhat
- **Gestion d'État & Auth** : Context API Next.js & JWT (SimpleJWT)
- **Réseau Blockchain** : Polygon Amoy (Testnet)

---

## 🚀 Guide d'Installation Complet (Dev Local)

### 1. Cloner le Projet
```bash
git clone <URL_DU_DEPOT_KOMOE>
cd komoe
```

### 2. Configuration du Backend Django
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Sur Windows
# source venv/bin/activate # Sur Mac/Linux

pip install -r requirements.txt
copy .env.example .env     # Sur Windows
# cp .env.example .env     # Sur Mac/Linux
```
Mettez à jour les variables d'environnement dans `backend/.env` avec vos identifiants PostgreSQL.
Si PostgreSQL n'est pas installé, le backend basculera **automatiquement sur SQLite3**.

```bash
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```
L'API tourne sur `http://localhost:8000`.

### 3. Configuration du Frontend Next.js
Ouvrez un nouveau terminal à la racine (`komoe/`) :
```bash
copy .env.example .env.local
npm install
npm run dev
```
L'application web tourne sur `http://localhost:3000`.

---

## 👥 Rôles Utilisateurs & Comptes de Test

| Email | Mot de passe | Rôle |
|---|---|---|
| `dgddl@komoe.ci` | `Komoe@2024!` | DGDDL |
| `cour.comptes@komoe.ci` | `Komoe@2024!` | Cour des Comptes |
| `maire.abobo@komoe.ci` | `Komoe@2024!` | Maire |
| `agent.abobo@komoe.ci` | `Komoe@2024!` | Agent Financier |
| `citoyen@komoe.ci` | `Komoe@2024!` | Citoyen |
| `journaliste@komoe.ci` | `Komoe@2024!` | Presse / ONG |
| `bailleur@komoe.ci` | `Komoe@2024!` | Bailleur |

---

## 💡 Fonctionnalités Principales Développées
- **Authentification & Redirection par Rôles** : Support multi-rôle complet via JWT.
- **Registre des Transactions** : Enregistrement et consultation on-chain.
- **Système de Validation Multisig** : Les transactions soumises par l'agent financier sont approuvées par le Maire puis scellées.
- **Thème Premium Dynamique** : Support complet des modes **Sombre** et **Clair**, avec contrastes et visibilité optimisés pour une lisibilité maximale.
- **Validation Intelligente des Catégories** : Normalisation souple des catégories de dépenses ODD, évitant toute erreur de validation 400.

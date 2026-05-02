# KOMOE — Plan d'action Hackathon
> Dernière mise à jour : 02/05/2026  
> Stack : Django REST + Next.js + Polygon Amoy + IPFS (Pinata)

---

## État actuel du projet

### ✅ Terminé
| # | Ce qui est en place |
|---|---|
| 1 | Backend Django : auth JWT, modèles, migrations, API communes + transactions |
| 2 | Seed : 7 comptes de test + 5 communes + transactions |
| 3 | Frontend : 33+ pages créées (controle/*, commune/*, public/*), build 0 erreur |
| 4 | Auth frontend : login → cookie JWT → proxy.ts → redirect par rôle |
| 5 | Blockchain service : `BlockchainService.is_configured()` safe en local sans clés |
| 6 | Phase 1 : rôles refactorisés, sidebar conditionnelle, layouts dynamiques |
| 7 | Phase 2 : toutes les pages branchées sur l'API Django (plus de mocks hardcodés) |

### ⏳ Reste à faire (dans l'ordre)
| Phase | Description | Qui |
|---|---|---|
| **Phase 3** | Créer les comptes externes (Alchemy, MetaMask, Pinata) | Toi — manuel |
| **Phase 4** | Valider l'intégration des clés en local (IPFS + blockchain) | Toi + IA |
| **Phase 5** | Déployer BudgetLedger.sol sur Polygon Amoy | Toi — manuel |
| **Phase 6** | Tester le flux blockchain complet de bout en bout | Toi |
| **Phase 7** | Intégration Ethers.js frontend (lecture blockchain publique) | IA + Toi |
| **Phase 8** | Score transparence + signalements + budget prévu vs réel | IA |
| **Phase 9** | Préparation démo hackathon (données réalistes + pitch) | Équipe |
| **Phase 10** | Déploiement production — **ACCORD ÉQUIPE OBLIGATOIRE** | Équipe |

> 🛑 **Règle d'équipe** : aucune action de déploiement (Phase 10) sans accord de Brou, Kablan et les autres membres. Si quelqu'un veut déployer, calme-le et dis-lui d'en parler au groupe d'abord.

---

## Architecture des rôles (décision finale)

### Groupe PUBLIC — `/public/*`
`CITOYEN` + `JOURNALISTE` fusionnés → rôle unique `CITOYEN` + champ `profession`

Pages : `dashboard` · `budget` · `transactions` · `signalement` · `verifier` · `comparatif` · `export` · `scores` · `blockchain` · `rapports`

> `BAILLEUR` → toutes les pages public + `/public/projets` exclusif

### Groupe COMMUNE — `/commune/*`
| Page | MAIRE | AGENT_FINANCIER |
|---|---|---|
| Dashboard, Budget, Profil | ✅ | ✅ |
| Transactions (liste) | ✅ | ✅ |
| **Validation blockchain** | ✅ | ❌ caché |
| **Citoyens, Signalements** | ✅ | ❌ caché |
| **Nouvelle transaction** | ❌ caché | ✅ |
| **En attente** | ❌ caché | ✅ |

### Groupe CONTROLE — `/controle/*`
| Page | DGDDL | COUR_COMPTES |
|---|---|---|
| Dashboard, Communes, Classement, Alertes, Rapports, Preuves, Blockchain, Export | ✅ | ✅ |
| **Gestion des comptes** | ✅ | ❌ caché |
| **Écriture / modification** | ✅ | ❌ lecture seule |

---

## PHASES 1 & 2 — ✅ TERMINÉES

Voir `STRUCTURE.md` section "Ce qui est implémenté" pour le détail complet.

---

## PHASE 3 — Comptes externes
**Durée : ~30 min | Qui : Toi uniquement (actions manuelles)**

### P3A — Alchemy (nœud RPC Polygon Amoy)
1. [alchemy.com](https://alchemy.com) → Sign Up → Create App → Polygon → Amoy Testnet
2. Copier l'URL HTTPS : `https://polygon-amoy.g.alchemy.com/v2/<CLE>`

```bash
# backend/.env
POLYGON_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/<CLE>
# .env.local
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/<CLE>
```

### P3B — MetaMask (wallet déployeur dédié au dev)
> ⚠️ Jamais ton wallet principal — wallet DÉDIÉ dev uniquement.

1. Installer extension MetaMask → Créer nouveau wallet → noter seed phrase
2. Ajouter réseau Polygon Amoy : RPC = URL Alchemy · Chain ID = `80002` · Symbol = `MATIC`
3. Exporter la clé privée : `...` → Account details → Show private key

```bash
# backend/.env SEULEMENT (jamais dans le frontend)
DEPLOYER_PRIVATE_KEY=0x<CLE_PRIVEE>
```

### P3C — Faucet MATIC de test
1. [faucet.polygon.technology](https://faucet.polygon.technology) → Amoy Testnet
2. Coller l'adresse MetaMask dev → Submit → attendre ~1 min
3. Vérifier sur [amoy.polygonscan.com](https://amoy.polygonscan.com) → ~0.5 MATIC reçus

### P3D — Pinata (stockage IPFS justificatifs PDF)
1. [pinata.cloud](https://pinata.cloud) → Sign Up → API Keys → New Key
2. Activer : `pinFileToIPFS` + `pinJSONToIPFS` · Nommer : `komoe-dev`
3. Copier le JWT token (commence par `eyJ...`)

```bash
# backend/.env
PINATA_JWT=eyJ...
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs
```

---

## PHASE 4 — Valider l'intégration des clés en local
**Durée : ~30 min | Qui : Toi teste, IA corrige si erreur**

> Cette phase est NOUVELLE — elle manquait dans le plan original.  
> On doit vérifier que les clés fonctionnent AVANT de déployer le contrat.

### P4A — Vérifier que Django voit les clés

```powershell
cd backend
venv\Scripts\activate
python manage.py shell
```
```python
from apps.blockchain.service import BlockchainService
svc = BlockchainService()
print(svc.is_configured())  # Doit afficher True
# Si False → vérifier backend/.env (variables mal renseignées)
```

### P4B — Tester l'upload IPFS (Pinata)

```powershell
# Tester avec un fichier PDF quelconque
python manage.py shell
```
```python
import requests
from django.conf import settings

with open("conftest.py", "rb") as f:
    r = requests.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        files={"file": f},
        headers={"Authorization": f"Bearer {settings.PINATA_JWT}"}
    )
print(r.json())
# Doit retourner {"IpfsHash": "Qm...", "PinSize": ..., "Timestamp": "..."}
# Si erreur 401 → PINATA_JWT mal copié
```

### P4C — Vérifier la connexion Polygon

```python
from apps.blockchain.service import BlockchainService
svc = BlockchainService()
w3 = svc._get_w3()
print(w3.is_connected())        # True
print(w3.eth.block_number)      # Un nombre > 0
print(w3.eth.chain_id)          # 80002 (Amoy)
```

**Résultat attendu :** tout affiche True / des valeurs valides.  
Si erreur → vérifier `POLYGON_RPC_URL` dans backend/.env.

---

## PHASE 5 — Déployer BudgetLedger.sol sur Polygon Amoy
**Durée : ~30 min | Qui : Toi via Remix IDE | Accord équipe : pas encore requis (testnet gratuit)**

### P5A — Vérifier le contrat avant déploiement

Le contrat `contracts/contracts/BudgetLedger.sol` doit avoir ces 4 fonctions qui correspondent **exactement** aux appels Python du `BlockchainService` :

```solidity
function soumettreDepense(string depenseId, string communeId, uint256 montant, string categorie, string ipfsHash) external
function validerDepense(string depenseId, string communeId, uint256 montant, string categorie, string ipfsHash) external
function enregistrerRecette(string recetteId, string communeId, uint256 montant, string source, string ipfsHash) external
function totalTransactions() external view returns (uint256)
```

### P5B — Déployer via Remix IDE

1. Aller sur [remix.ethereum.org](https://remix.ethereum.org)
2. Créer fichier `BudgetLedger.sol` → coller le contenu de `contracts/contracts/BudgetLedger.sol`
3. Onglet **Solidity Compiler** → version `0.8.x` → **Compile**
4. Onglet **Deploy & Run** :
   - Environment : **Injected Provider — MetaMask**
   - MetaMask → réseau **Polygon Amoy**
   - Cliquer **Deploy** → confirmer MetaMask
5. Copier l'**adresse du contrat** (commence par `0x`)

### P5C — Mettre à jour les .env et redémarrer

```bash
# backend/.env
CONTRACT_ADDRESS=0x<ADRESSE_DEPLOYEE>

# .env.local frontend
NEXT_PUBLIC_CONTRACT_ADDRESS=0x<ADRESSE_DEPLOYEE>
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
```

```powershell
# Redémarrer les deux serveurs
# Terminal 1 — Backend
python manage.py runserver

# Terminal 2 — Frontend
npm run dev
```

---

## PHASE 6 — Tester le flux blockchain complet de bout en bout
**Durée : ~45 min | Qui : Toi**

> Cette phase est NOUVELLE — elle manquait dans le plan original.  
> C'est la validation que tout s'enchaîne correctement avec la vraie blockchain.

### P6A — Test : Agent soumet avec justificatif PDF

1. Login `agent.abobo@komoe.ci`
2. `/commune/transactions/nouvelle`
3. Remplir formulaire + uploader un PDF (facture de test)
4. Soumettre

**Vérifications :**
- Transaction visible dans `/commune/en-attente` avec statut `SOUMIS` ✓
- En base Django : `ipfs_hash` renseigné (non vide) ✓
- En base Django : `blockchain_tx_hash_soumission` renseigné ✓
- Sur [amoy.polygonscan.com](https://amoy.polygonscan.com) : TX visible ✓

### P6B — Test : Maire valide et TX hash blockchain retourné

1. Login `maire.abobo@komoe.ci`
2. `/commune/validation` → cliquer "Valider sur Polygon"
3. Attendre ~2-5 secondes (confirmation blockchain)

**Vérifications :**
- Statut passe à `VALIDE` ✓
- `blockchain_tx_hash_validation` renseigné en base ✓
- Le TX hash visible sur [amoy.polygonscan.com](https://amoy.polygonscan.com) ✓
- Transaction disparue de `/controle/alertes` ✓

### P6C — Test : vérification anti-falsification IPFS

1. Récupérer l'`ipfs_hash` de la transaction
2. Accéder à `https://gateway.pinata.cloud/ipfs/<hash>` → PDF téléchargeable ✓
3. Le même hash est visible sur Polygonscan dans les données de la TX ✓
4. Si on modifie le PDF → le hash serait différent → falsification détectable ✓

### P6D — Test : Citoyen vérifie sur `/public/verifier`

1. Login `citoyen@komoe.ci`
2. `/public/transactions` → transaction validée visible ✓
3. `/public/verifier` → entrer le `blockchain_tx_hash_validation`
4. → Lien Polygonscan cliquable → transaction confirmée et immuable ✓

---

## PHASE 7 — Intégration Ethers.js frontend (lecture blockchain directe)
**Durée : ~1h | Qui : IA code, Toi valides**

> Cette phase est NOUVELLE — elle manquait dans le plan original.  
> Elle implémente la lecture directe de Polygon depuis le navigateur (sans passer par Django).  
> C'est ce qui donne la **vraie transparence** : le citoyen interroge la blockchain lui-même.

### P7A — Page `/public/blockchain`

Brancher la page sur Ethers.js pour afficher :
- Nombre total de transactions sur le contrat (`totalTransactions()`)
- Derniers blocs Polygon Amoy
- Lien vers le contrat sur Polygonscan

**Fichier :** `app/public/blockchain/page.tsx`  
**Lib utilisée :** `lib/abi/BudgetLedger.json` + Ethers.js v6 + `NEXT_PUBLIC_POLYGON_RPC_URL`

### P7B — Page `/public/verifier` — lecture blockchain directe

Améliorer la page pour qu'en plus de l'API Django, elle interroge Polygon directement :
```typescript
// lib/hooks/useBlockchainVerify.ts
import { ethers } from "ethers"
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_POLYGON_RPC_URL)
const tx = await provider.getTransaction(txHash)
const receipt = await provider.getTransactionReceipt(txHash)
// → Afficher : confirmé ✅, bloc, timestamp, statut
```

### P7C — Page `/controle/preuves`

Afficher les transactions validées avec :
- TX hash cliquable vers Polygonscan
- Lien IPFS cliquable vers le justificatif PDF
- Statut de confirmation blockchain

---

## PHASE 8 — Score transparence + fonctionnalités métier manquantes
**Durée : ~1h | Qui : IA code, Toi valides**

> Cette phase est NOUVELLE — elle manquait dans le plan original.  
> Elle complète les fonctionnalités métier nécessaires pour une vraie démo hackathon.

### P8A — Score de transparence calculé dynamiquement

Le score transparence est actuellement statique dans le serializer. Il doit être calculé :

**Fichier :** `backend/apps/communes/serializers.py`

```python
# Calcul du score_transparence basé sur :
# - % transactions validées / total (40 pts)
# - Régularité des publications (30 pts)
# - Completude des données (30 pts)
score = (validated_count / max(total_count, 1)) * 40
# + autres critères
```

### P8B — Budget prévu vs réalisé

Page `/commune/budget` doit comparer :
- `budget_annuel_fcfa` (prévu — champ Commune)
- Somme des `montant_fcfa` transactions VALIDE de l'année (réalisé)
- Graphique barre : prévu en gris, réalisé en couleur

### P8C — Système de signalement complet

- `/public/signalement` : formulaire citoyen → envoyer un signalement
- `/commune/signalements` : liste des signalements reçus par le Maire
- Backend : modèle `Signalement` + API REST (si pas encore fait)

### P8D — Classement communes par score

`/controle/classement` doit être trié par `score_transparence` DESC, avec badges :
- 🥇 Top 10 · 🔴 En retard (< 30) · ⚠️ Alerte (0 publication depuis 30j)

---

## PHASE 9 — Préparation démo hackathon
**Durée : ~1h | Qui : Équipe entière**

> À faire APRÈS que tout marche en local avec blockchain (Phases 3-8).

### P9A — Données de démo réalistes

Créer un nouveau seed `seed_demo.py` avec :
- 5 communes d'Abidjan (Cocody, Abobo, Plateau, Marcory, Yopougon)
- Transactions réalistes avec vraies catégories et montants crédibles
- Quelques transactions déjà validées sur blockchain (TX hash réels)
- Un justificatif PDF de test déjà uploadé sur IPFS

### P9B — Script de démo (scénario 10 min jury)

```
1. [30s] Montrer le problème : 65% d'irrégularités, < 3% citoyens informés
2. [1min] Connexion Agent → soumettre une dépense avec PDF
3. [1min] Connexion Maire → valider → TX hash Polygon visible
4. [1min] Polygonscan : preuve immuable visible par tout le monde
5. [1min] Connexion Citoyen → voir la transaction + vérifier le hash
6. [1min] DGDDL → classement transparence + alertes
7. [1min] Bailleur → score de transparence des communes
8. [1min] La même dépense ne PEUT PAS être modifiée → preuve anti-falsification
9. [2min] Impact : 3x plus de financements pour communes transparentes
10. [1min] Questions
```

### P9C — Checklist avant démo

- [ ] Toutes les pages chargent sans erreur en local
- [ ] Flux Agent → Maire → DGDDL → Citoyen fonctionne
- [ ] TX hash réel visible sur Polygonscan
- [ ] PDF justificatif accessible via IPFS
- [ ] Score de transparence s'affiche correctement
- [ ] Export CSV fonctionne
- [ ] Tous les comptes de test fonctionnent (7 comptes)
- [ ] Build Next.js sans erreur : `npm run build`
- [ ] Tests pytest tous PASSED : `pytest`

---

## PHASE 10 — Déploiement production
**🛑 ACCORD ÉQUIPE OBLIGATOIRE — Brou, Kablan et tous les membres**

> Ne commencer cette phase QUE si :
> 1. Toutes les phases 3-9 sont validées
> 2. L'équipe entière est d'accord
> 3. Le budget hosting est validé

### P10A — Backend Django (Render ou Railway)
- Créer service web sur [render.com](https://render.com)
- PostgreSQL managé sur Render (ou Supabase)
- Variables d'environnement : toutes les clés de production
- `DEBUG=False` · `ALLOWED_HOSTS=<domaine_prod>`

### P10B — Frontend Next.js (Vercel)
- Connecter le repo GitHub à [vercel.com](https://vercel.com)
- Variables d'environnement : `NEXT_PUBLIC_API_BASE_URL=<url_backend_prod>`
- Domaine : `komoe.ci` ou `budgetouvert.ci` (à acheter — accord équipe)

### P10C — Smart contract Mainnet (si nécessaire)
> ⚠️ Coûte de vrais MATIC — décision financière à prendre en équipe.
> Pour le hackathon, le **testnet Amoy suffit**.

---

## Récapitulatif — Qui fait quoi

| Phase | Action principale | IA | Toi (manuel) |
|---|---|---|---|
| ✅ P1 | Rôles, sidebar, layouts | ✅ codé | ✅ migrations lancées |
| ✅ P2 | Hooks API, pages branchées | ✅ codé | ✅ testé |
| ⏳ P3 | Comptes Alchemy/MetaMask/Pinata | — | ✅ inscriptions + copier clés |
| ⏳ P4 | Valider clés en local (shell Python) | ✅ aide debug | ✅ lancer les tests shell |
| ⏳ P5 | Déployer contrat sur Remix | ✅ vérifie contrat | ✅ déploie + copie adresse |
| ⏳ P6 | Tester flux blockchain bout en bout | ✅ corrige erreurs | ✅ teste manuellement |
| ⏳ P7 | Ethers.js frontend (lecture Polygon) | ✅ code | ✅ valide |
| ⏳ P8 | Score, signalements, budget prévu/réel | ✅ code | ✅ valide |
| ⏳ P9 | Démo, seed réaliste, checklist | ✅ aide | ✅ équipe |
| 🛑 P10 | Déploiement prod | ✅ aide | ✅ accord équipe |

---

## Variables d'environnement — Référence complète

### `backend/.env`
```bash
# Django
SECRET_KEY=django-insecure-dev-key-change-in-prod
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL (obligatoire)
DATABASE_URL=postgresql://komoe_user:MotDePasse@localhost:5432/komoe_dev

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Blockchain (Phase 3+5)
POLYGON_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/<CLE_ALCHEMY>
CONTRACT_ADDRESS=0x<ADRESSE_CONTRAT>
DEPLOYER_PRIVATE_KEY=0x<CLE_PRIVEE_WALLET_DEV>

# IPFS (Phase 3D)
PINATA_JWT=eyJhbGc...
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs
```

### `.env.local` (frontend Next.js)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Feature flags
NEXT_PUBLIC_USE_MOCK_DATA=false        # false = API Django réelle
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=false   # true = après Phase 5

# Blockchain (Phase 3+5)
NEXT_PUBLIC_POLYGON_CHAIN_ID=80002
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/<CLE>
NEXT_PUBLIC_CONTRACT_ADDRESS=0x<ADRESSE>
NEXT_PUBLIC_POLYGONSCAN_URL=https://amoy.polygonscan.com
NEXT_PUBLIC_ALCHEMY_API_KEY=<CLE_ALCHEMY>
```

---

## Lancer le projet en local

```powershell
# Terminal 1 — Backend Django
cd backend
venv\Scripts\activate
python manage.py runserver   # → http://localhost:8000

# Terminal 2 — Frontend Next.js
# (depuis la racine du projet)
npm run dev                  # → http://localhost:3000
```

---

*Ce plan est maintenu à jour. Cocher les phases au fur et à mesure.*

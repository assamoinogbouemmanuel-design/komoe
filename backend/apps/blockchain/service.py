"""
Service Web3.py — interaction avec BudgetLedger.sol sur Polygon Amoy.
Le backend signe les transactions côté serveur (pas de MetaMask côté client).
"""
import json
import os
from pathlib import Path
from typing import Optional

from django.conf import settings


class BlockchainService:
    """Encapsule tous les appels au smart contract BudgetLedger."""

    ABI_PATH = Path(__file__).resolve().parent.parent.parent.parent / "lib" / "abi" / "BudgetLedger.json"

    def __init__(self):
        self._w3 = None
        self._contract = None

    def is_configured(self) -> bool:
        """Vérifie si la blockchain est configurée (RPC URL + adresse contrat + clé privée)."""
        return bool(
            settings.POLYGON_RPC_URL
            and settings.CONTRACT_ADDRESS
            and settings.DEPLOYER_PRIVATE_KEY
        )

    def _get_w3(self):
        """Initialise Web3 (lazy loading)."""
        if self._w3 is None:
            from web3 import Web3
            self._w3 = Web3(Web3.HTTPProvider(settings.POLYGON_RPC_URL))
            if not self._w3.is_connected():
                raise ConnectionError(f"Impossible de se connecter au nœud RPC : {settings.POLYGON_RPC_URL}")
        return self._w3

    def _get_contract(self):
        """Charge le contrat (lazy loading)."""
        if self._contract is None:
            w3 = self._get_w3()
            if not self.ABI_PATH.exists():
                raise FileNotFoundError(f"ABI introuvable : {self.ABI_PATH}")
            with open(self.ABI_PATH, "r") as f:
                abi = json.load(f)
            self._contract = w3.eth.contract(
                address=Web3.to_checksum_address(settings.CONTRACT_ADDRESS),
                abi=abi,
            )
        return self._contract

    def _send_transaction(self, func) -> str:
        """Signe et envoie une transaction, retourne le TX hash."""
        from web3 import Web3
        w3 = self._get_w3()
        account = w3.eth.account.from_key(settings.DEPLOYER_PRIVATE_KEY)
        nonce = w3.eth.get_transaction_count(account.address)
        tx = func.build_transaction({
            "from": account.address,
            "nonce": nonce,
            "gas": 300_000,
            "gasPrice": w3.eth.gas_price,
        })
        signed = account.sign_transaction(tx)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        if receipt["status"] != 1:
            raise RuntimeError(f"Transaction échouée : {tx_hash.hex()}")
        return tx_hash.hex()

    def soumettre_depense(
        self,
        depense_id: str,
        commune_id: str,
        montant: int,
        categorie: str,
        ipfs_hash: str,
    ) -> str:
        contract = self._get_contract()
        func = contract.functions.soumettreDepense(
            depense_id, commune_id, montant, categorie, ipfs_hash
        )
        return self._send_transaction(func)

    def valider_depense(
        self,
        depense_id: str,
        commune_id: str,
        montant: int,
        categorie: str,
        ipfs_hash: str,
    ) -> str:
        contract = self._get_contract()
        func = contract.functions.validerDepense(
            depense_id, commune_id, montant, categorie, ipfs_hash
        )
        return self._send_transaction(func)

    def enregistrer_recette(
        self,
        recette_id: str,
        commune_id: str,
        montant: int,
        source: str,
        ipfs_hash: str,
    ) -> str:
        contract = self._get_contract()
        func = contract.functions.enregistrerRecette(
            recette_id, commune_id, montant, source, ipfs_hash
        )
        return self._send_transaction(func)

    def get_total_transactions(self) -> Optional[int]:
        """Lit le compteur de transactions (lecture gratuite, pas de gas)."""
        try:
            contract = self._get_contract()
            return contract.functions.totalTransactions().call()
        except Exception:
            return None

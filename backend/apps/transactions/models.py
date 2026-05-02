import uuid
from django.db import models
from django.conf import settings


class TransactionType(models.TextChoices):
    DEPENSE = "DEPENSE", "Dépense"
    RECETTE = "RECETTE", "Recette"


class TransactionStatut(models.TextChoices):
    BROUILLON = "BROUILLON", "Brouillon"
    SOUMIS = "SOUMIS", "Soumis (en attente de validation)"
    VALIDE = "VALIDE", "Validé sur blockchain"
    REJETE = "REJETE", "Rejeté"


class CategorieDepense(models.TextChoices):
    INFRASTRUCTURE = "INFRASTRUCTURE", "Infrastructure"
    SANTE = "SANTE", "Santé"
    EDUCATION = "EDUCATION", "Éducation"
    EAU_ASSAINISSEMENT = "EAU_ASSAINISSEMENT", "Eau & Assainissement"
    SECURITE = "SECURITE", "Sécurité"
    ADMINISTRATION = "ADMINISTRATION", "Administration"
    AGRICULTURE = "AGRICULTURE", "Agriculture"
    CULTURE_SPORT = "CULTURE_SPORT", "Culture & Sport"
    AUTRE = "AUTRE", "Autre"


class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    commune = models.ForeignKey(
        "communes.Commune",
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    type = models.CharField(max_length=10, choices=TransactionType.choices)
    statut = models.CharField(
        max_length=20,
        choices=TransactionStatut.choices,
        default=TransactionStatut.BROUILLON,
    )

    # Données financières
    montant_fcfa = models.BigIntegerField()
    categorie = models.CharField(max_length=50, choices=CategorieDepense.choices, default=CategorieDepense.AUTRE)
    description = models.TextField(blank=True, default="")
    periode = models.CharField(max_length=7, help_text="Format : YYYY-MM (ex: 2025-01)")

    # Documents
    ipfs_hash = models.CharField(max_length=100, blank=True, default="")
    ipfs_url = models.URLField(blank=True, default="")

    # Blockchain
    blockchain_tx_hash_soumission = models.CharField(max_length=100, blank=True, default="")
    blockchain_tx_hash_validation = models.CharField(max_length=100, blank=True, default="")
    blockchain_synced_at = models.DateTimeField(null=True, blank=True)

    # Acteurs
    soumis_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="transactions_soumises",
    )
    valide_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions_validees",
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    validated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "transactions"
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.type} {self.montant_fcfa:,} FCFA — {self.commune.nom} ({self.statut})"

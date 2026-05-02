from rest_framework import serializers
from .models import Transaction, TransactionStatut
from apps.users.serializers import UserSerializer
from apps.communes.serializers import CommuneSerializer


class TransactionSerializer(serializers.ModelSerializer):
    soumis_par_detail = UserSerializer(source="soumis_par", read_only=True)
    valide_par_detail = UserSerializer(source="valide_par", read_only=True)
    commune_detail = CommuneSerializer(source="commune", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id", "commune", "commune_detail", "type", "statut",
            "montant_fcfa", "categorie", "description", "periode",
            "ipfs_hash", "ipfs_url",
            "blockchain_tx_hash_soumission", "blockchain_tx_hash_validation",
            "blockchain_synced_at",
            "soumis_par", "soumis_par_detail",
            "valide_par", "valide_par_detail",
            "created_at", "updated_at", "validated_at",
        ]
        read_only_fields = [
            "id", "statut",
            "blockchain_tx_hash_soumission", "blockchain_tx_hash_validation",
            "blockchain_synced_at",
            "soumis_par", "valide_par",
            "created_at", "updated_at", "validated_at",
        ]


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["commune", "type", "montant_fcfa", "categorie", "description", "periode", "ipfs_hash"]

    def validate_montant_fcfa(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le montant doit être positif.")
        return value

    def create(self, validated_data):
        validated_data["soumis_par"] = self.context["request"].user
        validated_data["statut"] = TransactionStatut.SOUMIS
        return super().create(validated_data)

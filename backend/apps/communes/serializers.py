from rest_framework import serializers
from django.db.models import Sum
from .models import Commune


class CommuneSerializer(serializers.ModelSerializer):
    budget_depense_fcfa = serializers.SerializerMethodField()
    score_transparence = serializers.SerializerMethodField()

    class Meta:
        model = Commune
        fields = [
            "id", "code", "nom", "region", "population", "superficie_km2",
            "budget_annuel_fcfa", "maire_nom", "is_active",
            "budget_depense_fcfa", "score_transparence",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_budget_depense_fcfa(self, obj):
        val = getattr(obj, "_budget_depense", None)
        if val is not None:
            return int(val)
        from apps.transactions.models import Transaction, TransactionStatut, TransactionType
        result = Transaction.objects.filter(
            commune=obj,
            statut=TransactionStatut.VALIDE,
            type=TransactionType.DEPENSE,
        ).aggregate(total=Sum("montant_fcfa"))
        return int(result["total"] or 0)

    def get_score_transparence(self, obj):
        depense = self.get_budget_depense_fcfa(obj)
        tx_count = getattr(obj, "_tx_count", None)
        if tx_count is None:
            from apps.transactions.models import Transaction, TransactionStatut
            tx_count = Transaction.objects.filter(
                commune=obj, statut=TransactionStatut.VALIDE
            ).count()
        budget = obj.budget_annuel_fcfa or 0
        if budget > 0:
            rate = min(depense / budget, 1.0)
            base = 40 + int(rate * 40)
        else:
            base = 20
        tx_bonus = min(int(tx_count) * 3, 20)
        return min(base + tx_bonus, 100)

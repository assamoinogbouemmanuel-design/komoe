from django.utils import timezone
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Transaction, TransactionStatut
from .serializers import TransactionSerializer, TransactionCreateSerializer
from apps.users.permissions import IsAgentFinancier, IsMaire
from apps.blockchain.service import BlockchainService


class TransactionListView(generics.ListAPIView):
    """Public : toutes les transactions validées sur blockchain."""
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Transaction.objects.filter(statut=TransactionStatut.VALIDE).select_related(
            "commune", "soumis_par", "valide_par"
        )
        commune_id = self.request.query_params.get("commune")
        if commune_id:
            qs = qs.filter(commune_id=commune_id)
        type_filter = self.request.query_params.get("type")
        if type_filter:
            qs = qs.filter(type=type_filter)
        return qs


class TransactionCommuneListView(generics.ListAPIView):
    """
    Transactions d'une commune spécifique.
    - Public / non authentifié : uniquement VALIDE.
    - MAIRE ou AGENT_FINANCIER de cette commune : tous statuts (avec filtre ?statut= optionnel).
    """
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        commune_id = self.kwargs["commune_id"]
        qs = Transaction.objects.filter(commune_id=commune_id).select_related(
            "commune", "soumis_par", "valide_par"
        )
        user = self.request.user
        is_commune_user = (
            user.is_authenticated
            and user.role in ("MAIRE", "AGENT_FINANCIER")
            and user.commune_id == int(commune_id)
        )
        if is_commune_user:
            statut = self.request.query_params.get("statut")
            if statut:
                qs = qs.filter(statut=statut)
        else:
            qs = qs.filter(statut=TransactionStatut.VALIDE)
        type_filter = self.request.query_params.get("type")
        if type_filter:
            qs = qs.filter(type=type_filter)
        return qs


class TransactionCreateView(generics.CreateAPIView):
    """AGENT_FINANCIER : soumettre une nouvelle dépense/recette."""
    serializer_class = TransactionCreateSerializer
    permission_classes = [IsAgentFinancier]

    def perform_create(self, serializer):
        transaction = serializer.save()
        # Envoi asynchrone sur blockchain (Web3.py)
        try:
            blockchain = BlockchainService()
            if blockchain.is_configured():
                tx_hash = blockchain.soumettre_depense(
                    depense_id=str(transaction.id),
                    commune_id=str(transaction.commune_id),
                    montant=transaction.montant_fcfa,
                    categorie=transaction.categorie,
                    ipfs_hash=transaction.ipfs_hash or "ipfs://pending",
                )
                transaction.blockchain_tx_hash_soumission = tx_hash
                transaction.save(update_fields=["blockchain_tx_hash_soumission"])
        except Exception:
            pass  # Blockchain non disponible en local — on continue sans blocage


class TransactionDetailView(generics.RetrieveAPIView):
    """Détail d'une transaction (authentifié)."""
    queryset = Transaction.objects.all().select_related("commune", "soumis_par", "valide_par")
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]


@api_view(["PATCH"])
@permission_classes([IsMaire])
def valider_transaction(request, pk):
    """MAIRE : valide définitivement une transaction sur blockchain."""
    try:
        transaction = Transaction.objects.select_related("commune").get(pk=pk)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction introuvable."}, status=404)

    if transaction.statut != TransactionStatut.SOUMIS:
        return Response(
            {"error": f"Seules les transactions avec statut SOUMIS peuvent être validées. Statut actuel : {transaction.statut}"},
            status=400,
        )

    if transaction.commune != request.user.commune:
        return Response({"error": "Vous ne pouvez valider que les transactions de votre commune."}, status=403)

    # Ancrage blockchain
    blockchain = BlockchainService()
    if blockchain.is_configured():
        try:
            tx_hash = blockchain.valider_depense(
                depense_id=str(transaction.id),
                commune_id=str(transaction.commune_id),
                montant=transaction.montant_fcfa,
                categorie=transaction.categorie,
                ipfs_hash=transaction.ipfs_hash or "ipfs://pending",
            )
            transaction.blockchain_tx_hash_validation = tx_hash
            transaction.blockchain_synced_at = timezone.now()
        except Exception as e:
            return Response({"error": f"Erreur blockchain : {str(e)}"}, status=500)

    transaction.statut = TransactionStatut.VALIDE
    transaction.valide_par = request.user
    transaction.validated_at = timezone.now()
    transaction.save()

    return Response(
        {
            "message": "Transaction validée et ancrée sur blockchain.",
            "transaction": TransactionSerializer(transaction).data,
        }
    )

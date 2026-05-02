from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import RegisterSerializer, UserSerializer, UserCreateByAdminSerializer
from .permissions import IsDGDDL


class RegisterView(generics.CreateAPIView):
    """Inscription libre — CITOYEN et JOURNALISTE uniquement."""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Compte créé avec succès.",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class MeView(generics.RetrieveUpdateAPIView):
    """Profil de l'utilisateur connecté."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListCreateView(generics.ListCreateAPIView):
    """DGDDL uniquement : liste et création des comptes institutionnels."""
    queryset = User.objects.all().select_related("commune")
    permission_classes = [IsDGDDL]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return UserCreateByAdminSerializer
        return UserSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """DGDDL : consulter/modifier/désactiver un utilisateur."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsDGDDL]
    lookup_field = "id"


@api_view(["PATCH"])
@permission_classes([IsDGDDL])
def verify_journalist(request, id):
    """DGDDL : vérifie le badge journaliste d'un utilisateur."""
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({"error": "Utilisateur introuvable."}, status=404)

    user.journaliste_verifie = True
    user.save(update_fields=["journaliste_verifie"])
    return Response({"message": "Journaliste vérifié.", "user": UserSerializer(user).data})

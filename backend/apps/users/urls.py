from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView, UserListCreateView, UserDetailView, verify_journalist

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", TokenObtainPairView.as_view(), name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("users/", UserListCreateView.as_view(), name="users-list"),
    path("users/<uuid:id>/", UserDetailView.as_view(), name="users-detail"),
    path("users/<uuid:id>/verify-journalist/", verify_journalist, name="verify-journalist"),
]

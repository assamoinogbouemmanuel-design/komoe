from rest_framework.permissions import BasePermission
from .models import Role


class IsDGDDL(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == Role.DGDDL


class IsAgentFinancier(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == Role.AGENT_FINANCIER


class IsMaire(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == Role.MAIRE


class IsInstitutional(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_institutional_role


class IsPublicUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_public_role


class IsAgentOrMaire(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in (
            Role.AGENT_FINANCIER, Role.MAIRE
        )

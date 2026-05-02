from django.db import models


class Region(models.TextChoices):
    ABIDJAN = "ABIDJAN", "Abidjan"
    BOUAKE = "BOUAKE", "Bouaké"
    YAMOUSSOUKRO = "YAMOUSSOUKRO", "Yamoussoukro"
    DALOA = "DALOA", "Daloa"
    SAN_PEDRO = "SAN_PEDRO", "San-Pédro"
    KORHOGO = "KORHOGO", "Korhogo"
    AUTRE = "AUTRE", "Autre"


class Commune(models.Model):
    code = models.CharField(max_length=20, unique=True)
    nom = models.CharField(max_length=200)
    region = models.CharField(max_length=50, choices=Region.choices, default=Region.AUTRE)
    population = models.PositiveIntegerField(default=0)
    superficie_km2 = models.FloatField(default=0)
    budget_annuel_fcfa = models.BigIntegerField(default=0)
    maire_nom = models.CharField(max_length=200, blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "communes"
        verbose_name = "Commune"
        verbose_name_plural = "Communes"
        ordering = ["nom"]

    def __str__(self):
        return f"{self.nom} ({self.region})"

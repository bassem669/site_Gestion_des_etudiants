from django.db import models
from django.contrib.auth.hashers import make_password

class Utilisateur(models.Model):
    ROLE_CHOICES = [
        ('etudiant', 'Étudiant'),
        ('enseignant', 'Enseignant'),
        ('admin', 'Administrateur'),
    ]
    CIN = models.IntegerField(primary_key=True, unique=True)
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    ddn = models.DateField()
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.role.capitalize()} - {self.nom} {self.prenom}"


class Etudiant(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE,primary_key=True)
    note = models.ManyToManyField('mainApp.Matiere',through='mainApp.Note')
    classeEtudiant = models.ForeignKey('mainApp.Classe', on_delete=models.CASCADE, null=True, blank=True)



    def __str__(self):
        return f"Etudiant : {self.user.nom} {self.user.prenom}"


class Enseignant(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE,primary_key=True)
    niveau = models.CharField(max_length=100)
    salaire = models.FloatField()


    def __str__(self):
        return f"Enseignant : {self.user.nom} {self.user.prenom}"


class Administrateur(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE,primary_key=True)
    poste = models.CharField(max_length=100)

    def __str__(self):
        return f"Admin : {self.user.nom} {self.user.prenom}"

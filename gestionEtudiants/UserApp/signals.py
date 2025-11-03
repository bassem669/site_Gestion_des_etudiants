from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Utilisateur, Etudiant, Enseignant, Administrateur

@receiver(post_delete, sender=Utilisateur)
def delete_linked_user_type(sender, instance, **kwargs):
    """Supprime le modèle spécifique lié à l'utilisateur (étudiant, enseignant, administrateur)."""
    if instance.role == 'etudiant':
        try:
            Etudiant.objects.get(user=instance).delete()
        except Etudiant.DoesNotExist:
            pass
    elif instance.role == 'enseignant':
        try:
            Enseignant.objects.get(user=instance).delete()
        except Enseignant.DoesNotExist:
            pass
    elif instance.role == 'admin':
        try:
            Administrateur.objects.get(user=instance).delete()
        except Administrateur.DoesNotExist:
            pass


@receiver(post_delete, sender=Etudiant)
def delete_user_with_etudiant(sender, instance, **kwargs):
    try:
        instance.user.delete()
    except Utilisateur.DoesNotExist:
        pass


@receiver(post_delete, sender=Enseignant)
def delete_user_with_enseignant(sender, instance, **kwargs):
    try:
        instance.user.delete()
    except Utilisateur.DoesNotExist:
        pass


@receiver(post_delete, sender=Administrateur)
def delete_user_with_administrateur(sender, instance, **kwargs):
    try:
        instance.user.delete()
    except Utilisateur.DoesNotExist:
        pass

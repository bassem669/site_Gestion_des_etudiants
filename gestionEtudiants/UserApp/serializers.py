from rest_framework import serializers
from .models import Utilisateur, Etudiant, Enseignant, Administrateur

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['CIN', 'nom', 'prenom', 'ddn', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Utilisateur(**validated_data)
        user.set_password(password)  # Hash le mot de passe
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class EtudiantSerializer(serializers.ModelSerializer):
    user = UtilisateurSerializer()

    class Meta:
        model = Etudiant
        fields = ['user', 'classeEtudiant']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        utilisateur = Utilisateur.objects.create(**user_data)
        etudiant = Etudiant.objects.create(user=utilisateur, **validated_data)
        return etudiant
    

    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        # Mise à jour des données de l'utilisateur
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # Mise à jour des champs de l'étudiant
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance




class EnseignantSerializer(serializers.ModelSerializer):
    user = UtilisateurSerializer()

    class Meta:
        model = Enseignant
        fields = ['user', 'niveau', 'salaire']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        utilisateur = Utilisateur.objects.create(**user_data)
        enseignant = Enseignant.objects.create(user=utilisateur, **validated_data)
        return enseignant
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance




class AdministrateurSerializer(serializers.ModelSerializer):
    user = UtilisateurSerializer()

    class Meta:
        model = Administrateur
        fields = ['user', 'poste']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        utilisateur = Utilisateur.objects.create(**user_data)
        admin = Administrateur.objects.create(user=utilisateur, **validated_data)
        return admin



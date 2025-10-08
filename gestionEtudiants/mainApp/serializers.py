from rest_framework import serializers
from .models import *

class NoteSerializer(serializers.ModelSerializer) :

    class Meta :
        model = Note
        fields = '__all__'

class MatiereSerializer(serializers.ModelSerializer) :

    class Meta :
        model = Matiere
        fields = '__all__'

        
class ClasseSerializer(serializers.ModelSerializer) :

    class Meta :
        model = Classe
        fields = '__all__'
    
class AbsenceSerializer(serializers.ModelSerializer) :

    class Meta :
        model = Absence
        fields = '__all__'

class EnseignementSerializer(serializers.ModelSerializer) :
    libelleMatiere = serializers.CharField(source='matiere.libelle', read_only=True)

    class Meta :
        model = Enseignement
        fields = ['id', 'jour', 'heureDepart', 'enseignant', 'libelleMatiere', 'matiere', 'classeEnseignant']
    

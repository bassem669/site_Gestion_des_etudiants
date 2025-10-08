
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from UserApp.serializers import *
from .models import Classe,Matiere,Note,Absence,Enseignement
from .serializers import NoteSerializer,MatiereSerializer,ClasseSerializer,AbsenceSerializer,EnseignementSerializer
from UserApp.models import *
from rest_framework.decorators import api_view



class ClasseAPI(APIView) :
    
    def get(self,request) :
        obj = Classe.objects.all()
        serializer = ClasseSerializer(obj,many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def post(self,request) :
        data = request.data
        classe = ClasseSerializer(data=data)
        if classe.is_valid() :
            obj = classe.save()
            return Response(classe.data, status=status.HTTP_201_CREATED)
        return Response(classe.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def put(self,request) :
        data = request.data
        try :
            obj = Classe.objects.get(nomClass=data.get('nomClass'))
        except :
            return Response({"message": "La classe n'existe pas"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ClasseSerializer(obj,data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self,request,id) :
    
        deleted_count, _ = Classe.objects.filter(nomClass=id).delete()

        if deleted_count == 0:
            return Response({"message": "La classe n'existe pas"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Classe supprimée avec succès"}, status=status.HTTP_200_OK)



class MatiereAPI(APIView) :

    def get(self,request) :
        matiere = Matiere.objects.all()
        serializer = MatiereSerializer(matiere,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def post(self,request) :
        data = request.data
        matiere = MatiereSerializer(data=data)
        if matiere.is_valid() :
            matiere.save()
            return Response({"msg" : 'le sauvgard est faire sucess'},status=status.HTTP_200_OK)
        return Response({"error" : "error l'hors de l'ajote"},status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request,id) :
        data = request.data
        try : 
            matiere = Matiere.objects.get(idMatiere=id)
        except Matiere.DoesNotExist :
            return Response({'error' : "Le matiere n'est pas existe"},status=status.HTTP_404_NOT_FOUND)

        serializer = MatiereSerializer(matiere,data=data)
        if serializer.is_valid() :
            serializer.save()
            return Response({"msg" : 'le modification succes'},status=status.HTTP_200_OK)
        return Response({"error" : "error l'hors de la modification"},status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,idMatiere) : 

        deleted_count, _ = Matiere.objects.get(idMatiere=id).delete()
        if deleted_count == 0 :
           return Response({"message": "Le matiere n'existe pas"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "matiere supprimée avec succès"}, status=status.HTTP_200_OK) 
    

class NoteAPI(APIView) :
    def get(self,request) :
        notes = Note.objects.select_related('etudiant').all()
        data = [
            {
                'CIN' : note.etudiant.user_id,
                'nom': note.etudiant.user.nom,
                'ds': note.ds,
                'tp': note.tp,
                'examen': note.examen,
                'idMatiere' : note.matiere.idMatiere,
                'matiere' : note.matiere.libelle
            } for note in notes
        ]
        return Response(data)

    def post(self, request):
        for data in request.data:
            etudiant, _ = Etudiant.objects.get(CIN=data['CIN'])
            matiere = Matiere.objects.get(id=data['idMatiere'])
            Note.objects.create(
                etudiant=etudiant,
                ds=float(data['ds']),
                tp=float(data['tp']),
                examen=float(data['examen']),
                matiere=matiere
            )
        return Response({"message": "Notes enregistrées."}, status=status.HTTP_201_CREATED)
    
    def put(self,request) :
        data = request.data
        etudiant = data.get('etudiant')
        matiere = data.get('matiere')

        note = Note.objects.get(etudiant=etudiant,matiere=matiere)
        serializer = NoteSerializer(note,data=data)
        if serializer.is_valid() :
            serializer.save()
            return Response({"msg" : 'le modification succes'},status=status.HTTP_200_OK)
        return Response({"error" : "error l'hors de la modification"},status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request) :
        data = request.data
        etudiant = data.get('etudiant')
        matiere = data.get('matiere')

        delete_count,_ = Note.objects.get(etudiant=etudiant,matiere=matiere).delete()

        if delete_count == 0 :
            return Response({"message": "Le note n'existe pas"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "note supprimée avec succès"}, status=status.HTTP_200_OK) 



        
    


class AbsenceAPI(APIView) :

    def get(self,request) :
        absence = Absence.objects.all()
        serializer = AbsenceSerializer(absence,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def post(self,request) :
        data = request.data
        serializer = AbsenceSerializer(data=data)
        if serializer.is_valid() :
            serializer.save()
            return Response({"msg" : 'le sauvgard est faire sucess'},status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request) :
        data = request.data
        etudiant = data.get('etudiant')
        matiere = data.get('matiere')

        absence = Absence.objects.get(etudiant=etudiant,matiere=matiere)
        serializer = AbsenceSerializer(absence,data=data)
        if serializer.is_valid() :
            serializer.save()
            return Response({"msg" : 'le modification succes'},status=status.HTTP_200_OK)
        return Response({"error" : "error l'hors de la modification"},status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request) :
        data = request.data
        etudiant = data.get('etudiant')
        matiere = data.get('matiere')
        
        delete_count,_ = Absence.objects.get(etudiant=etudiant,matiere=matiere).delete()

        if delete_count == 0 :
            return Response({"message": "Le Absence n'existe pas"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Absence supprimée avec succès"}, status=status.HTTP_200_OK) 


class EnseignementAPI(APIView) :
    
    def get(self,request) :
        enseignement = Enseignement.objects.all()
        serializer = EnseignementSerializer(enseignement,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def post(self,request) :
        data = request.data
        serializer = EnseignementSerializer(data=data)
        if serializer.is_valid() :
            serializer.save()
            return Response({"msg" : 'le sauvgard est faire sucess'},status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request) :
        data = request.data
        enseignant = data.get('enseignant')
        matiere = data.get('matiere')

        enseignement = Enseignement.objects.get(enseignant=enseignant,matiere=matiere)
        serializer = EnseignementSerializer(enseignement,data=data)
        if serializer.is_valid() :
            serializer.save()
            return Response({"msg" : 'le modification succes'},status=status.HTTP_200_OK)
        return Response({"error" : "error l'hors de la modification"},status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request) :
        data = request.data
        etudiant = data.get('etudiant')
        matiere = data.get('matiere')
        
        delete_count,_ = Enseignement.objects.get(etudiant=etudiant,matiere=matiere).delete()

        if delete_count == 0 :
            return Response({"message": "Le Enseignement n'existe pas"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Enseignement supprimée avec succès"}, status=status.HTTP_200_OK) 

    


@api_view(["get"])
def getEnseignement(request,enseignant_id) : 
    
    try:
        enseignant = Enseignant.objects.get(user_id=enseignant_id)
    except Enseignant.DoesNotExist:
        return Response({"error": "Enseignant non trouvé."}, status=status.HTTP_404_NOT_FOUND)

    enseignements = enseignant.enseignement.select_related('matiere', 'classeEnseignant').all()
    serializer = EnseignementSerializer(enseignements, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getClass(request, class_id):
    try:
        # Get all students in the specified class
        etudiants = Etudiant.objects.filter(classeEtudiant=class_id)
        
        # Serialize the data
        serializer = EtudiantSerializer(etudiants, many=True)
        
        return Response(serializer.data)
    
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['GET'])
def getAbsenceEtudiant(request, cin):
    try:
        etudiant = Etudiant.objects.get(user_id=cin)
        absence = Absence.objects.filter(etudiant=etudiant)
        serializer = AbsenceSerializer(absence,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Absence.DoesNotExist:
        return Response({'message': 'Aucune absence trouvée pour cet étudiant.'}, status=status.HTTP_404_NOT_FOUND)
    except Etudiant.DoesNotExist:
        return Response({'message': 'Étudiant introuvable avec ce CIN.'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def getNoteEtudiant(request, cin):
    try:
        etudiant = Etudiant.objects.get(user_id=cin)
        notes = Note.objects.filter(etudiant=etudiant)
        serializer = NoteSerializer(notes,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response({'message': 'Aucune absence trouvée pour cet étudiant.'}, status=status.HTTP_404_NOT_FOUND)
    except Etudiant.DoesNotExist:
        return Response({'message': 'Étudiant introuvable avec ce CIN.'}, status=status.HTTP_404_NOT_FOUND)
    
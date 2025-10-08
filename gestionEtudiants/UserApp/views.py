from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http.response import JsonResponse
from django.contrib.auth.hashers import check_password

from mainApp.models import Classe
from .models import Administrateur, Enseignant, Etudiant, Utilisateur 
from .serializers import AdministrateurSerializer, EnseignantSerializer, EtudiantSerializer, UtilisateurSerializer

# check login user
@api_view(['POST'])
def login(request):
    email = request.data.get('user').get('email')
    password = request.data.get('user').get('password')

    if not email or not password:
        return JsonResponse({'error': 'Email et mot de passe requis'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Utilisateur.objects.get(email=email)
        if check_password(password, user.password):
            role = user.role.lower()
            if role == "etudiant":
                etudiant = Etudiant.objects.get(user=user)
                serializer = EtudiantSerializer(etudiant)
            elif role == "enseignant":
                enseignant = Enseignant.objects.get(user=user)
                serializer = EnseignantSerializer(enseignant)
            elif role == "admin":
                admin = Administrateur.objects.get(user=user)
                serializer = AdministrateurSerializer(admin)
            else:
                return JsonResponse({'error': 'Rôle non reconnu'}, status=status.HTTP_400_BAD_REQUEST)

            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)

    except Utilisateur.DoesNotExist:
        return JsonResponse({'error': 'Email non trouvé'}, status=status.HTTP_404_NOT_FOUND)

# ajouter utilisateur
@api_view(['POST'])
def ajouter_user(request) :
    role = request.data.get('user').get('role').lower()

    if role == 'etudiant':
        serializer = EtudiantSerializer(data=request.data)
    elif role == 'enseignant':
        serializer = EnseignantSerializer(data=request.data)
    elif role == 'admin':
        serializer = AdministrateurSerializer(data=request.data)
    else:
        return JsonResponse({'error': 'Rôle invalide'}, status=status.HTTP_400_BAD_REQUEST)

    if serializer.is_valid():
        obj = serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
def update_user(request):
    cin = request.data.get('user', {}).get('CIN')
    if not cin:
        return JsonResponse({'error': 'CIN manquant'}, status=400)

    try:
        user = Utilisateur.objects.get(CIN=cin)
        nvRole = request.data.get('user', {}).get('role', '').lower()
        ancienRole = user.role.lower()

        if ancienRole == nvRole:
            # Mise à jour sans changer de rôle
            if ancienRole == 'etudiant':
                instance = Etudiant.objects.get(user=user)
                serializer = EtudiantSerializer(instance, data=request.data, partial=True)
            elif ancienRole == 'enseignant':
                instance = Enseignant.objects.get(user=user)
                serializer = EnseignantSerializer(instance, data=request.data, partial=True)
            elif ancienRole == 'admin':
                instance = Administrateur.objects.get(user=user)
                serializer = AdministrateurSerializer(instance, data=request.data, partial=True)
            else:
                return JsonResponse({'error': 'Rôle invalide'}, status=400)
        else:
            # Changement de rôle - nécessite une recréation
            if nvRole == 'etudiant':
                serializer = EtudiantSerializer(data=request.data)
            elif nvRole == 'enseignant':
                serializer = EnseignantSerializer(data=request.data)
            elif nvRole == 'admin':
                serializer = AdministrateurSerializer(data=request.data)
            else:
                return JsonResponse({'error': 'Nouveau rôle invalide'}, status=400)

            if serializer.is_valid():
                user.delete()  # Supprime l'ancien après validation

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    except Utilisateur.DoesNotExist:
        return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
    except (Etudiant.DoesNotExist, Enseignant.DoesNotExist, Administrateur.DoesNotExist):
        return JsonResponse({'error': 'Profil spécifique non trouvé'}, status=404)
    

@api_view(['DELETE'])
def delete_user(request,cin):
    try:
        user = Utilisateur.objects.get(CIN=cin)
        user.delete()
        return JsonResponse({'message': "L'utilisateur a été supprimé avec succès."}, status=status.HTTP_200_OK)
    except Utilisateur.DoesNotExist:
        return JsonResponse({'error': "L'utilisateur est introuvable."}, status=status.HTTP_404_NOT_FOUND)

    

@api_view(['GET'])
def consulter_comptes(request):
    etudiant = Etudiant.objects.all()
    eserializer = EtudiantSerializer(etudiant,many=True)
    enseignat = Enseignant.objects.all()
    enserializer = EnseignantSerializer(enseignat,many=True)

    admin = Administrateur.objects.all()
    aserializer = AdministrateurSerializer(admin,many=True)
    users = {
        'etudiant': eserializer.data,
        'enseignant': enserializer.data,
        'administrateur': aserializer.data
    }
    return Response(users, status=200)

@api_view(['Put'])
def affecterEtudiant(request) :
    data = request.data
    cin = data.get("CIN")
    try :
        classe = Classe.objects.get(nomClass=data.get("nomClass"))
        user = Utilisateur.objects.get(CIN=cin)
        etudiant = Etudiant.objects.get(user=user)
    except Classe.DoesNotExist :
        return Response({"msg" : "le class n'est pas existe"})
    except (Utilisateur.DoesNotExist, Etudiant.DoesNotExist) :
        return Response({"msg" : "le etudiant n'est pas existe"})
    
    etudiant.classeEtudiant = classe
    etudiant.save()

    serializer = EtudiantSerializer(etudiant)
    return JsonResponse(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def getAllEtudiant(request):
    etudiant = Etudiant.objects.all()
    serializer = EtudiantSerializer(etudiant,many=True)
    
    return Response(serializer.data, status=200)

@api_view(['GET'])
def getAllEnsiegnemant(request):
    enseignant = Enseignant.objects.all()
    serializer = EnseignantSerializer(enseignant,many=True)
    
    return Response(serializer.data, status=200)


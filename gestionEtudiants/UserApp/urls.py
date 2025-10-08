from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('login/', login), 
    path('ajouter_user/',ajouter_user),
    path('update_user/<int:cin>/', update_user),
    path('delete_user/<int:cin>/',delete_user),
    path('consulter_comptes/',consulter_comptes),
    path('affecterEtudiant/',affecterEtudiant),
    path('getAllEtudiant/',getAllEtudiant),
    path('getAllEnsiegnemant/',getAllEnsiegnemant),

]

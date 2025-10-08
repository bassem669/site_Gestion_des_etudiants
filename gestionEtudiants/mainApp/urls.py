from django.urls import path
from .views import *
urlpatterns = [
    path("consulerClass/",ClasseAPI.as_view(),name='consulter-class'),
    path('ajouteClass/',ClasseAPI.as_view(),name='ajoute-classe'),
    path('modifierClass/',ClasseAPI.as_view(),name='modifier-class'),
    path('supprimierClass/<str:id>/',ClasseAPI.as_view(),name='supprimier-class'),

    path("consulerMatiere/",MatiereAPI.as_view(),name='consulter-Matiere'),
    path('ajouteMatiere/',MatiereAPI.as_view(),name='ajoute-Matieree'),
    path('modifierMatiere/<int:id>/',MatiereAPI.as_view(),name='modifier-Matiere'),
    path('supprimierMatiere/<int:idMatiere>/',MatiereAPI.as_view(),name='supprimier-Matiere'),

    path("consulerNote/",NoteAPI.as_view(),name='consulter-Note'),
    path('ajouteNote/',NoteAPI.as_view(),name='ajoute-Notee'),
    path('modifierNote/',NoteAPI.as_view(),name='modifier-Note'),
    path('supprimierNote/',NoteAPI.as_view(),name='supprimier-Note'),

    path("consulerAbsence/",AbsenceAPI.as_view(),name='consulter-Absence'),
    path('ajouteAbsence/',AbsenceAPI.as_view(),name='ajoute-Absencee'),
    path('modifierAbsence/',AbsenceAPI.as_view(),name='modifier-Absence'),
    path('supprimierAbsence/',AbsenceAPI.as_view(),name='supprimier-Absence'),
    
    path("consulerEnseignement/",EnseignementAPI.as_view(),name='consulter-Enseignement'),
    path('ajouteEnseignement/',EnseignementAPI.as_view(),name='ajoute-Enseignemente'),
    path('modifierEnseignement/',EnseignementAPI.as_view(),name='modifier-Enseignement'),
    path('supprimierEnseignement/',EnseignementAPI.as_view(),name='supprimier-Enseignement'),

    path('enseignant/<int:enseignant_id>/',getEnseignement),
    path('etudiant/<str:class_id>/',getClass),
    path('consulterAbsenceEtudiant/<int:cin>/',getAbsenceEtudiant),
    path('consulterNoteEtudiant/<int:cin>/',getNoteEtudiant),
    


]
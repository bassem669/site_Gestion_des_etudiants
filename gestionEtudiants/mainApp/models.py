from django.db import models

class Matiere(models.Model):
    idMatiere = models.AutoField(primary_key=True)
    libelle = models.CharField(max_length=50)

    def __str__(self):
        return self.libelle



class Note(models.Model):
    ds = models.FloatField(blank=True,null=True)
    tp = models.FloatField(blank=True,null=True)
    examen = models.FloatField(blank=True,null=True)
    etudiant = models.ForeignKey('UserApp.Etudiant', on_delete=models.CASCADE, related_name='notes')
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.etudiant.user.nom} - {self.matiere.libelle} : {self.valeur}"

class Classe(models.Model):
    nomClass = models.CharField( max_length=20,primary_key=True)
    nbEtudiants = models.IntegerField()

    def __str__(self):
        return f"{self.nomClass} - {self.nbEtudiants}"
    


class Absence(models.Model):
    dateAbssence = models.DateTimeField(auto_now_add=True)
    etudiant = models.ForeignKey('UserApp.Etudiant', on_delete=models.CASCADE, related_name='absences')
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.etudiant.user.nom} - {self.matiere.libelle} : {self.valeur}"

class Enseignement(models.Model) :
    enseignant = models.ForeignKey('UserApp.Enseignant',on_delete=models.CASCADE,related_name='enseignement')
    matiere = models.ForeignKey(Matiere,on_delete=models.CASCADE)
    classeEnseignant = models.ForeignKey(Classe,on_delete=models.CASCADE)
    jour = models.CharField(max_length=10)
    heureDepart = models.TimeField()

    def __str__(self):
        return f"{self.enseignant.user.nom} - {self.matiere.libelle} - {self.classeEnseignant.nomClass} : {self.dateEnseignement}"







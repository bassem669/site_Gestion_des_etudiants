import React, { useEffect, useState } from 'react';

function MarquerAbsence() {
  const [enseignements, setEnseignements] = useState([]);
  const [matiere, setMatiere] = useState('');
  const [classe, setClasse] = useState('');
  const [jour, setJour] = useState('');
  const [heure, setHeure] = useState('');
  const [absences, setAbsences] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  // Récupérer les enseignements de l'enseignant
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/main/enseignant/${user.user.CIN}/`)
      .then(res => res.json())
      .then(data => setEnseignements(data))
      .catch(error => console.error('Erreur lors de la récupération des enseignements :', error));
  }, [user.user.CIN]);

  // Met à jour jour/heure en fonction de la matière + classe sélectionnées
  useEffect(() => {
    const selected = enseignements.find(e =>
      e.matiere?.toString() === matiere && e.classeEnseignant === classe
    );
    if (selected) {
      setJour(selected.jour);
      setHeure(selected.heureDepart);
    } else {
      setJour('');
      setHeure('');
    }
  }, [matiere, classe, enseignements]);

  // Récupérer les étudiants de la classe sélectionnée
  useEffect(() => {
    if (classe) {
      fetch(`http://127.0.0.1:8000/main/etudiant/${classe}/`)
        .then(res => res.json())
        .then(data => {
          setEtudiants(data);
          // Initialiser les absences pour chaque étudiant
          setAbsences(data.map(etudiant => ({
            id: etudiant.user.CIN,
            nom: `${etudiant.user.nom} ${etudiant.user.prenom}`,
            absent: false,
            matiere: matiere,
            classe: classe,
            date: new Date().toISOString().split('T')[0] // Date du jour au format YYYY-MM-DD
          })));
        })
        .catch(error => console.error('Erreur lors de la récupération des étudiants :', error));
    }
  }, [classe, matiere]);

  // Extraire matières et classes sans doublons
  const matieresDisponibles = Array.from(
    new Map(enseignements.map(e => [e.matiere, e.libelleMatiere])).entries()
  ).map(([id, nom]) => ({ id: id.toString(), nom }));

  const classesDisponibles = [...new Set(enseignements.map(e => e.classeEnseignant))];

  // Gérer changement des absences
  const handleAbsenceChange = (etudiantId) => {
    setAbsences(prevAbsences =>
      prevAbsences.map(et => 
        et.id === etudiantId ? { ...et, absent: !et.absent } : et
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:8000/main/consulerAbsence/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          absences: absences
            .filter(a => a.absent) // Envoyer seulement les absences
            .map(absence => ({
              etudiant: absence.id,
              matiere: matiere,
              classe: absence.classe,
              date: absence.date,
              justifie: false, // Par défaut non justifié
              enseignant: user.user.CIN
            }))
        }),
      });

      if (response.ok) {
        alert('Absences enregistrées avec succès!');
      } else {
        throw new Error('Erreur lors de l\'enregistrement des absences');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'enregistrement');
    }
  };

  // Mise à jour des absences existantes
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Implémentez la logique de mise à jour ici
    alert('Fonctionnalité de mise à jour à implémenter');
  };

  // Date et heure actuelles
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="container py-4">
      <div className="mb-4 border rounded p-3 bg-light shadow-sm d-flex justify-content-between align-items-center">
        <div>
          <h5>Enseignant : {user.user.nom}</h5>

          <div className="ms-3 mt-2">
            <label htmlFor="matiere" className="form-label">Matière :</label>
            <select
              id="matiere"
              className="form-select"
              value={matiere}
              onChange={(e) => setMatiere(e.target.value)}
              required
            >
              <option value="">Sélectionnez une matière</option>
              {matieresDisponibles.map(m => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>
          </div>

          <div className="ms-3 mt-2">
            <label htmlFor="classe" className="form-label">Classe :</label>
            <select
              id="classe"
              className="form-select"
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              required
            >
              <option value="">Sélectionnez une classe</option>
              {classesDisponibles.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="mb-1 text-end">Date : {date}</p>
          <p className="mb-1 text-end">Heure : {time}</p>
          <p className="mb-1 text-end">Jour : {jour || '—'}</p>
          <p className="mb-1 text-end">Créneau : {heure || '—'}</p>
        </div>
      </div>

      {matiere && classe && (
        <>
          <h2 className="mb-4 text-center">Marquer les absences</h2>

          <form onSubmit={handleSubmit}>
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Nom de l'étudiant</th>
                  <th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {absences.map((etudiant) => (
                  <tr key={etudiant.id}>
                    <td>{etudiant.nom}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={etudiant.absent}
                        onChange={() => handleAbsenceChange(etudiant.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">Enregistrer les absences</button>
              <button
                type="button"
                className="btn btn-danger ms-4"
                onClick={handleUpdate}
              >
                Mise à jour des absences
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default MarquerAbsence;
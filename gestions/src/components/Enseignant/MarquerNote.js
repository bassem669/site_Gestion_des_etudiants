import React, { useEffect, useState } from 'react';

function MarquerNote() {
  const [enseignements, setEnseignements] = useState([]);
  const [matiere, setMatiere] = useState('');
  const [classe, setClasse] = useState('');
  const [jour, setJour] = useState('');
  const [heure, setHeure] = useState('');
  const [notes, setNotes] = useState([]);
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
          // Initialiser les notes pour chaque étudiant
          setNotes(data.map(etudiant => ({
            id: etudiant.user.CIN,
            nom: `${etudiant.user.nom} ${etudiant.user.prenom}`,
            ds: '',
            tp: '',
            examen: '',
            matiere: matiere,
            classe: classe
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

  // Gérer changement des notes
  const handleNoteChange = (etudiantId, type, value) => {
    setNotes(prevNotes =>
      prevNotes.map(et => 
        et.id === etudiantId ? { ...et, [type]: value } : et
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:8000/main/notes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: notes.map(note => ({
            etudiant: note.id,
            matiere: matiere,
            classe: classe,
            ds: note.ds,
            tp: note.tp,
            examen: note.examen,
            enseignant: user.user.CIN
          }))
        }),
      });

      if (response.ok) {
        alert('Notes enregistrées avec succès!');
      } else {
        throw new Error('Erreur lors de l\'enregistrement des notes');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'enregistrement');
    }
  };

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
          <p className="mb-1 text-end">Jour : {jour || '—'}</p>
          <p className="mb-1 text-end">Heure : {heure || '—'}</p>
        </div>
      </div>

      {matiere && classe && (
        <>
          <h2 className="mb-4 text-center">Saisie des Notes</h2>

          <form onSubmit={handleSubmit}>
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Nom de l'étudiant</th>
                  <th>DS</th>
                  <th>TP</th>
                  <th>Examen</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((etudiant) => (
                  <tr key={etudiant.id}>
                    <td>{etudiant.nom}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="20"
                        step="0.5"
                        value={etudiant.ds}
                        onChange={(e) => handleNoteChange(etudiant.id, 'ds', e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="20"
                        step="0.5"
                        value={etudiant.tp}
                        onChange={(e) => handleNoteChange(etudiant.id, 'tp', e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="20"
                        step="0.5"
                        value={etudiant.examen}
                        onChange={(e) => handleNoteChange(etudiant.id, 'examen', e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">Enregistrer les notes</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default MarquerNote;
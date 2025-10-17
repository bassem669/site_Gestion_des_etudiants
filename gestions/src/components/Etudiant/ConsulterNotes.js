import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Badge, Modal, Button } from 'react-bootstrap';

const ConsulterNote = () => {
  const [notes, setNotes] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les notes
        const notesResponse = await fetch(`http://127.0.0.1:8000/main/consulterNoteEtudiant/${user.user.CIN}/`);
        if (notesResponse.status === 404) setNotes([]);
        else if (!notesResponse.ok) throw new Error('Erreur lors du chargement des notes');
        else {
          const notesData = await notesResponse.json();
          setNotes(notesData);
        }

        // Charger les matières
        const matieresResponse = await fetch('http://127.0.0.1:8000/main/consulerMatiere/');
        if (!matieresResponse.ok) throw new Error('Erreur lors du chargement des matières');
        const matieresData = await matieresResponse.json();
        setMatieres(matieresData);

        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.user.CIN]);

  // Obtenir le nom de la matière à partir de l'ID
  const getMatiereName = (matiereId) => {
    console.log(matiereId);
    const matiere = matieres.find((m) => m.idMatiere === matiereId);
    return matiere ? matiere.libelle : 'Matière inconnue';
  };

  // Obtenir les détails complets d'une matière
  const getMatiereDetails = (matiereId) => {
    return matieres.find((m) => m.id === matiereId) || {};
  };

  // Calculer la note finale (30% DS, 20% TP, 50% Examen)
  const calculateFinalNote = (note) => {
    const ds = note.ds || 0;
    const tp = note.tp || 0;
    const examen = note.examen || 0;
    return (ds * 0.3 + tp * 0.2 + examen * 0.5).toFixed(2);
  };

  // Afficher le modal de détails
  const handleShowDetails = (matiereId) => {
    setSelectedMatiere(matiereId);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-4 border rounded p-3 bg-light shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>Étudiant : {user.user.nom} {user.user.prenom}</h5>
            <p className="mb-1"><strong>CIN :</strong> {user.user.CIN}</p>
            <p className="mb-1"><strong>Email :</strong> {user.user.email}</p>
          </div>
          <div>
            <p className="mb-1"><strong>Date de naissance :</strong> {user.user.ddn}</p>
            <p className="mb-0"><strong>Classe :</strong> {user.classeEtudiant}</p>
          </div>
        </div>
      </div>

      <h2 className="mb-4">Notes académiques</h2>

      {/* Tableau des notes */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Matière</th>


              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.length > 0 ? (
              notes.map((note, index) => {
                const matiereName = getMatiereName(note.matiere);
                const finalNote = calculateFinalNote(note);
                const isSuccess = finalNote >= 10;
                return (
                  <tr key={index}>
                    <td>{matiereName}</td>
                
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowDetails(note.matiere)}
                      >
                        Détails
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Aucune note disponible pour le moment</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de détails */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la matière</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMatiere && (
            <>
              <h5>{getMatiereName(selectedMatiere)}</h5>
              <div className="mb-3">
                <p><strong>Enseignant :</strong> {getMatiereDetails(selectedMatiere).enseignant || 'Non spécifié'}</p>
                <p><strong>Volume horaire :</strong> {getMatiereDetails(selectedMatiere).volumeHoraire || 'N/A'} heures</p>
                <p><strong>Description :</strong> {getMatiereDetails(selectedMatiere).description || 'Aucune description disponible'}</p>
              </div>

              <h6>Détail des notes</h6>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>DS</td>
                    <td>{notes.find((n) => n.matiere === selectedMatiere)?.ds || 'N/A'}</td>

                  </tr>
                  <tr>
                    <td>TP</td>
                    <td>{notes.find((n) => n.matiere === selectedMatiere)?.tp || 'N/A'}</td>

                  </tr>
                  <tr>
                    <td>Examen</td>
                    <td>{notes.find((n) => n.matiere === selectedMatiere)?.examen || 'N/A'}</td>

                  </tr>
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConsulterNote;
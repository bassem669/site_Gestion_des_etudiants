import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Modal, Button } from 'react-bootstrap';

const ListeNotesEtudiants = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user?.CIN) {
        setError('Utilisateur non authentifié');
        setLoading(false);
        return;
      }

      try {
        // Charger les étudiants
        const etudiantsResponse = await fetch('http://127.0.0.1:8000/user/getAllEtudiant/');
        if (!etudiantsResponse.ok) {
          throw new Error(`Erreur ${etudiantsResponse.status}: Impossible de charger les étudiants`);
        }
        const etudiantsData = await etudiantsResponse.json();

        // Charger les notes
        const notesResponse = await fetch('http://127.0.0.1:8000/main/consulerNote/');
        if (!notesResponse.ok) {
          throw new Error(`Erreur ${notesResponse.status}: Impossible de charger les notes`);
        }
        const notesData = await notesResponse.json();

        // Associer les notes aux étudiants
        const etudiantsAvecNotes = etudiantsData.map((etudiant) => ({
          ...etudiant,
          notes: notesData.filter((note) => note.CIN === etudiant.user.CIN),
        }));

        setEtudiants(etudiantsAvecNotes);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les étudiants selon la recherche
  const filteredEtudiants = etudiants.filter((etudiant) => {
    const searchLower = searchTerm.trim().toLowerCase();
    return (
      etudiant.user.nom.toLowerCase().includes(searchLower) ||
      etudiant.user.prenom.toLowerCase().includes(searchLower) ||
      etudiant.user.CIN.toString().includes(searchLower) ||
      etudiant.classeEtudiant.toLowerCase().includes(searchLower)
    );
  });

  const handleViewDetails = (etudiant) => {
    setSelectedStudent(etudiant);
    setShowModal(true);
  };

  const handlePrint = () => {
    window.print();
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
    <div className="container py-4">
      {/* En-tête administrateur */}
      <div className="mb-4 border rounded p-3 bg-light shadow-sm">
        <h5>Administrateur : {user?.user?.nom || 'N/A'} {user?.user?.prenom || ''}</h5>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="mb-1"><strong>CIN :</strong> {user?.user?.CIN || 'N/A'}</p>
            <p className="mb-1"><strong>Email :</strong> {user?.user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="mb-1"><strong>Date de naissance :</strong> {user?.user?.ddn || 'N/A'}</p>
            <p className="mb-0"><strong>Poste :</strong> {user?.poste || 'N/A'}</p>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-center">Liste des Étudiants et leurs Notes</h2>

      {/* Barre de recherche */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher par nom, prénom, CIN ou classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des étudiants */}
      {filteredEtudiants.length > 0 ? (
        filteredEtudiants.map((etudiant) => (
          <div key={etudiant.user.CIN} className="mb-4 border rounded p-3 shadow-sm bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {etudiant.user.nom} {etudiant.user.prenom}{' '}
                <span className="text-muted ms-2">({etudiant.classeEtudiant})</span>
              </h5>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleViewDetails(etudiant)}
                >
                  <i className="bi bi-eye-fill"></i> Détails
                </Button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-sm table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Matière</th>
                    <th>DS</th>
                    <th>TP</th>
                    <th>Examen</th>
                  </tr>
                </thead>
                <tbody>
                  {etudiant.notes.length > 0 ? (
                    etudiant.notes.map((note, index) => (
                      <tr key={index}>
                        <td>{note.matiere}</td>
                        <td>{note.ds.toFixed(2)}</td>
                        <td>{note.tp.toFixed(2)}</td>
                        <td>{note.examen.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Aucune note enregistrée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-info">
          Aucun étudiant ne correspond à votre recherche.
        </div>
      )}

      {/* Modal pour les détails */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Détails des notes - {selectedStudent?.user.nom} {selectedStudent?.user.prenom}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <p><strong>CIN :</strong> {selectedStudent.user.CIN}</p>
                  <p><strong>Email :</strong> {selectedStudent.user.email}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Classe :</strong> {selectedStudent.classeEtudiant}</p>
                </div>
              </div>

              <h5>Notes par matière</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Matière</th>
                      <th>DS</th>
                      <th>TP</th>
                      <th>Examen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.notes.length > 0 ? (
                      selectedStudent.notes.map((note, index) => (
                        <tr key={index}>
                          <td>{note.matiere}</td>
                          <td>{note.ds.toFixed(2)}</td>
                          <td>{note.tp.toFixed(2)}</td>
                          <td>{note.examen.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Aucune note enregistrée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <i className="bi bi-printer-fill me-2"></i>Imprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListeNotesEtudiants;
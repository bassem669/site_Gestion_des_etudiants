import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';

const ListeAbsencesEtudiants = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [etudiantSelectionne, setEtudiantSelectionne] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState({
    etudiants: true,
    absences: true,
    matieres: true
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Charger les données depuis les APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les étudiants
        const etudiantsResponse = await fetch('http://127.0.0.1:8000/user/getAllEtudiant/');
        if (!etudiantsResponse.ok) throw new Error('Erreur étudiants');
        const etudiantsData = await etudiantsResponse.json();
        setEtudiants(etudiantsData);
        setLoading(prev => ({...prev, etudiants: false}));

        // Charger les absences
        const absencesResponse = await fetch('http://127.0.0.1:8000/main/consulerAbsence/');
        if (!absencesResponse.ok) throw new Error('Erreur absences');
        const absencesData = await absencesResponse.json();
        setAbsences(absencesData);
        setLoading(prev => ({...prev, absences: false}));

        // Charger les matières
        const matieresResponse = await fetch('http://127.0.0.1:8000/main/consulerMatiere/');
        if (!matieresResponse.ok) throw new Error('Erreur matières');
        const matieresData = await matieresResponse.json();
        setMatieres(matieresData);
        setLoading(prev => ({...prev, matieres: false}));

      } catch (error) {
        console.error('Erreur:', error);
        setError('Échec du chargement des données');
        setLoading({
          etudiants: false,
          absences: false,
          matieres: false
        });
      }
    };

    fetchData();
  }, []);

  // Compter les absences par étudiant et par matière
  const countAbsences = () => {
    const counts = {};
    
    absences.forEach(absence => {
      if (!counts[absence.etudiant]) {
        counts[absence.etudiant] = {};
      }
      
      if (!counts[absence.etudiant][absence.matiere]) {
        counts[absence.etudiant][absence.matiere] = 0;
      }
      
      counts[absence.etudiant][absence.matiere]++;
    });
    
    return counts;
  };

  const absenceCounts = countAbsences();

  // Filtrer les étudiants selon la recherche
  const filteredEtudiants = etudiants.filter(etudiant => {
    const searchLower = searchTerm.toLowerCase();
    return (
      etudiant.user.CIN.toString().includes(searchLower) ||
      etudiant.user.nom.toLowerCase().includes(searchLower) ||
      etudiant.user.prenom.toLowerCase().includes(searchLower) ||
      etudiant.classeEtudiant.toLowerCase().includes(searchLower)
    );
  });

  const handleOpenModal = (etudiant) => {
    setEtudiantSelectionne(etudiant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getStatusColor = (nbAbsences) => {
    if (nbAbsences > 3) return 'danger';
    if (nbAbsences > 1) return 'warning';
    return 'success';
  };

  const getStatusText = (nbAbsences) => {
    if (nbAbsences > 3) return 'Éliminé';
    if (nbAbsences > 1) return 'Avertissement';
    return 'Autorisé';
  };

  const getMatiereName = (matiereId) => {
    const matiere = matieres[matiereId];
    return matiere.libelle ? matiere.libelle : 'Matière inconnue';
  };

  const isLoading = loading.etudiants || loading.absences || loading.matieres;

  if (isLoading) {
    return (
      <div className="container py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p>Chargement des données...</p>
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
      <div className="mb-4 border rounded p-3 bg-light shadow-sm">
        <h5>Administrateur : {user.user.nom}</h5>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="mb-1"><strong>CIN :</strong> {user.user.CIN}</p>
            <p className="mb-1"><strong>Email :</strong> {user.user.email}</p>
          </div>
          <div>
            <p className="mb-1"><strong>Date de naissance :</strong> {user.user.ddn}</p>
            <p className="mb-0"><strong>Poste :</strong> {user.poste}</p>
          </div>
        </div>
      </div>

      <h2 className="text-center mb-4">Liste des étudiants et leurs absences</h2>

      {/* Barre de recherche */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher par CIN, nom, prénom ou classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des étudiants */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>CIN</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Classe</th>
              <th>Total Absences</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEtudiants.length > 0 ? (
              filteredEtudiants.map((etudiant) => {
                const etudiantAbsences = absenceCounts[etudiant.user.CIN] || {};
                const totalAbsences = Object.values(etudiantAbsences).reduce((sum, count) => sum + count, 0);
                
                return (
                  <tr key={etudiant.user.CIN}>
                    <td>{etudiant.user.CIN}</td>
                    <td>{etudiant.user.nom}</td>
                    <td>{etudiant.user.prenom}</td>
                    <td>{etudiant.classeEtudiant}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(totalAbsences)}`}>
                        {totalAbsences}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenModal(etudiant)}
                      >
                        <i className="bi bi-eye-fill me-1"></i> Détails
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Aucun étudiant trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal des détails */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails des absences</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {etudiantSelectionne && (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <p><strong>Nom complet :</strong> {etudiantSelectionne.user.nom} {etudiantSelectionne.user.prenom}</p>
                  <p><strong>CIN :</strong> {etudiantSelectionne.user.CIN}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Classe :</strong> {etudiantSelectionne.classeEtudiant}</p>
                  <p><strong>Email :</strong> {etudiantSelectionne.user.email}</p>
                </div>
              </div>

              <h5>Détail des absences par matière</h5>
              {absenceCounts[etudiantSelectionne.user.CIN] ? (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Matière</th>
                        <th>Nombre d'absences</th>
                        <th>État</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(absenceCounts[etudiantSelectionne.user.CIN]).map(([matiereId, count]) => (
                        <tr key={matiereId}>
                          <td>{getMatiereName(parseInt(matiereId))}</td>
                          <td>{count}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(count)}`}>
                              {getStatusText(count)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  Cet étudiant n'a aucune absence enregistrée.
                </div>
              )}

              <div className="alert alert-info mt-3">
                <strong>Total des absences :</strong> {absenceCounts[etudiantSelectionne.user.CIN] 
                  ? Object.values(absenceCounts[etudiantSelectionne.user.CIN]).reduce((sum, count) => sum + count, 0)
                  : 0}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListeAbsencesEtudiants;
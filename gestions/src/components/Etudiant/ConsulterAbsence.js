import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Modal, Button, Badge } from 'react-bootstrap';

const ConsulterAbsence = () => {
  const [absences, setAbsences] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMatiere, setExpandedMatiere] = useState(null);
  const [showJustifyModal, setShowJustifyModal] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState(null);

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
        // Charger les absences
        const absencesResponse = await fetch(`http://127.0.0.1:8000/main/consulterAbsenceEtudiant/${user.user.CIN}/`);
        if (absencesResponse.status === 404) {
          setAbsences([]);
        } else if (!absencesResponse.ok) {
          throw new Error(`Erreur ${absencesResponse.status}: Impossible de charger les absences`);
        } else {
          const absencesData = await absencesResponse.json();
          setAbsences(absencesData); // Directly set the array
        }

        // Charger les matières
        const matieresResponse = await fetch('http://127.0.0.1:8000/main/consulerMatiere/');
        if (!matieresResponse.ok) {
          throw new Error(`Erreur ${matieresResponse.status}: Impossible de charger les matières`);
        }
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
  }, [user?.user?.CIN]);

  // Grouper les absences par matière
  const groupedAbsences = absences.reduce((acc, absence) => {
    const matiere = matieres.find(m => m.idMatiere === absence.matiere);
    const matiereNom = matiere ? matiere.libelle : 'Matière inconnue';
    
    if (!acc[matiereNom]) acc[matiereNom] = [];
    acc[matiereNom].push(absence);
    return acc;
  }, {});

  // Calculer le total des absences
  const totalAbsences = absences.length;

  // Toggle l'affichage des détails d'une matière
  const toggleMatiereDetails = (matiere) => {
    setExpandedMatiere(prev => (prev === matiere ? null : matiere));
  };

  // Ouvre le modal pour justifier une absence
  const openJustifyModal = (absence) => {
    setSelectedAbsence(absence);
    setShowJustifyModal(true);
  };

  // Ferme le modal
  const handleCloseModal = () => {
    setShowJustifyModal(false);
    setSelectedAbsence(null);
  };

  // Placeholder pour soumettre une justification
  const handleJustifySubmit = () => {
    // TODO: Implémenter l'API pour soumettre une justification
    console.log('Justification soumise pour absence:', selectedAbsence);
    handleCloseModal();
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
      {/* En-tête étudiant */}
      <div className="mb-4 border rounded p-3 bg-light shadow-sm">
        <h5>Étudiant : {user?.user?.nom || 'N/A'} {user?.user?.prenom || ''}</h5>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="mb-1"><strong>CIN :</strong> {user?.user?.CIN || 'N/A'}</p>
            <p className="mb-1"><strong>Email :</strong> {user?.user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="mb-1"><strong>Date de naissance :</strong> {user?.user?.ddn || 'N/A'}</p>
            <p className="mb-0"><strong>Classe :</strong> {user?.classeEtudiant || 'N/A'}</p>
          </div>
        </div>
      </div>

      <h2 className="mb-4">Résumé des absences</h2>

      <div className="alert alert-info mb-4">
        <strong>Total des absences :</strong> {totalAbsences}
        {totalAbsences > 0 && (
          <span className="ms-3">
            <strong>Statut global :</strong>{' '}
            {totalAbsences > 10 ? (
              <Badge bg="danger">Situation critique</Badge>
            ) : totalAbsences > 5 ? (
              <Badge bg="warning">Attention</Badge>
            ) : (
              <Badge bg="success">Normal</Badge>
            )}
          </span>
        )}
      </div>

      {/* Tableau des absences */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Matière</th>
              <th>Nombre d'absences</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedAbsences).length > 0 ? (
              Object.entries(groupedAbsences).map(([matiere, absencesMatiere], index) => {
                const isElimine = absencesMatiere.length > 3;
                return (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{matiere}</td>
                      <td>{absencesMatiere.length}</td>
                      <td>
                        {isElimine ? (
                          <Badge bg="danger">Éliminé</Badge>
                        ) : (
                          <Badge bg={absencesMatiere.length > 1 ? 'warning' : 'success'}>
                            {absencesMatiere.length > 1 ? 'Avertissement' : 'Normal'}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => toggleMatiereDetails(matiere)}
                          className="me-2"
                        >
                          {expandedMatiere === matiere ? 'Masquer' : 'Détails'}
                        </Button>
                      </td>
                    </tr>
                    {expandedMatiere === matiere && (
                      <tr>
                        <td colSpan="4">
                          <div className="p-3 bg-light">
                            <h6>Détail des absences en {matiere}</h6>
                            <table className="table table-sm table-bordered">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Heure</th>
                                </tr>
                              </thead>
                              <tbody>
                                {absencesMatiere.map((absence, idx) => (
                                  <tr key={idx}>
                                    <td>{new Date(absence.dateAbssence).toLocaleDateString('fr-FR')}</td>
                                    <td>
                                      {new Date(absence.dateAbssence).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </td>
                                    
              
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Aucune absence enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};

export default ConsulterAbsence;
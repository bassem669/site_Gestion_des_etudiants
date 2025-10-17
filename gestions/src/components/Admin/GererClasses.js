import React, { useState, useEffect } from "react";

function GestionClasses() {
  const [classes, setClasses] = useState([]);
  const [etudiant, setEtudiant] = useState([]);
  const [nouvelleClasse, setNouvelleClasse] = useState('');
  const [nvnbEtudiants, setNvnbEtudiants] = useState('');
  const [classeActive, setClasseActive] = useState(null);
  const [etudiants, setEtudiants] = useState([]);

  const [erreurs, setErreurs] = useState({ classe: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Charger les classes depuis l'API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const responseClass = await fetch('http://127.0.0.1:8000/main/consulerClass/');
        if (!responseClass.ok) {
          throw new Error('Erreur lors du chargement des classes');
        }
        const dataClass = await responseClass.json();
        setClasses(dataClass);


        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Échec du chargement des classes');
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Charger les étudiants d'une classe
  const fetchEtudiants = async (nomClasse) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/main/etudiant/${nomClasse}/`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des étudiants');
      }
      const data = await response.json();
      setEtudiants(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Échec du chargement des étudiants');
    }
  };

  const ajouterClasse = async () => {
    if (nouvelleClasse.trim() === "") {
      setErreurs({ ...erreurs, classe: "Le nom de la classe est requis." });
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/main/ajouteClass/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nomClass: nouvelleClasse,
          nbEtudiants : nvnbEtudiants
        })
      });

      if (!response.ok) {
        throw new Error('Échec de la création de la classe');
      }

      // Recharger la liste des classes
      const updatedResponse = await fetch('http://127.0.0.1:8000/main/consulerClass/');
      const updatedData = await updatedResponse.json();
      setClasses(updatedData);
      setNouvelleClasse("");
      setErreurs({ ...erreurs, classe: "" });
    } catch (err) {
      console.error('Erreur:', err);
      setError('Échec de la création de la classe');
    }
  };


  const consulterClasse = (classe) => {
    setClasseActive(classe);
    setErreurs({ CIN: "", email: "" });
    fetchEtudiants(classe.nomClass);
  };

  const supprimerEtudiant = async (email) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer cet étudiant ?`)) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/user/supprimerEtudiantClass/${email}/`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression de l\'étudiant');
      }

      // Recharger la liste des étudiants
      await fetchEtudiants(classeActive.nomClass);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Échec de la suppression de l\'étudiant');
    }
  };

  if (loading) {
    return <div className="container py-4 text-center">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="container py-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
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

      <h2 className="text-center mb-4">Gérer les Classes</h2>

      <div className="mb-4">
        <div className="d-flex">
          <input
            type="text"
            className={`form-control me-2 ${erreurs.classe ? 'is-invalid' : ''}`}
            placeholder="Nouvelle classe"
            value={nouvelleClasse}
            onChange={(e) => {
              setNouvelleClasse(e.target.value);
              setErreurs({ ...erreurs, classe: "" });
            }}
          />

          <input
            type="number"
            className={`form-control me-2 ${erreurs.nvnbEtudiants ? 'is-invalid' : ''}`}
            placeholder="Nombres maximals des etudiants"
            value={nvnbEtudiants}
            onChange={(e) => {
              setNvnbEtudiants(e.target.value);
              setErreurs({ ...erreurs, nvnbEtudiants: "" });
            }}
          />
          <button className="btn btn-success" onClick={ajouterClasse}>
            Ajouter
          </button>
        </div>
        {erreurs.classe && <div className="text-danger mt-1">{erreurs.classe}</div>}
        {erreurs.nvnbEtudiants && <div className="text-danger mt-1">{erreurs.nvnbEtudiants}</div>}
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>Nom de la classe</th>
            <th>Nombre d'étudiants / Capacité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classe) => (
            <React.Fragment key={classe.nomClass}>
              <tr>
                <td>{classe.nomClass}</td>
                <td>
                  {etudiants.length} / {classe.nbEtudiants}
                  {etudiants.length >= classe.nbEtudiants && (
                    <span className="ms-2 badge bg-danger">Pleine</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => consulterClasse(classe)}
                  >
                    Consulter
                  </button>
                </td>
              </tr>

              {classeActive?.nomClass === classe.nomClass && (
                <tr>
                  <td colSpan="3">
                    <h5>Étudiants de la classe {classe.nomClass}</h5>
                    <div className="alert alert-info">
                      Capacité maximale: {classe.nbEtudiants} étudiants | 
                      Étudiants inscrits: {etudiants.length} |
                      Places restantes: {classe.nbEtudiants - etudiants.length}
                    </div>
                    
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {etudiants.map((etudiant) => (
                          <tr key={etudiant.user.email}>
                            <td>{etudiant.user.nom}</td>
                            <td>{etudiant.user.email}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => supprimerEtudiant(etudiant.email)}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionClasses;
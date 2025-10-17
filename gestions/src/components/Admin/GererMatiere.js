import React, { useState, useEffect } from "react";

function GestionMatiere() {
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [classes, setClasses] = useState([]);
  const [nouvelleMatiere, setNouvelleMatiere] = useState({
    libelle: "",
  });
  const [editId, setEditId] = useState(null);
  const [erreurs, setErreurs] = useState({
    libelle: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {

        const matieresResponse = await fetch('http://127.0.0.1:8000/main/consulerMatiere/');
        if (!matieresResponse.ok) throw new Error('Erreur lors du chargement des matières');
        const matieresData = await matieresResponse.json();
        setMatieres(matieresData);

        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Échec du chargement des données');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setNouvelleMatiere({ ...nouvelleMatiere, [e.target.name]: e.target.value });
    setErreurs({ ...erreurs, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    const libelleValide = /^[A-Za-zÀ-ÿ\s'-]{3,}$/.test(nouvelleMatiere.libelle.trim());

    if (!libelleValide) errs.libelle = "libelle invalide (3 lettres minimum)";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErreurs(errs);
      return;
    }

    try {
      let response;
      if (editId) {

        response = await fetch(`http://127.0.0.1:8000/main/modifierMatiere/${editId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nouvelleMatiere)
        });
      } else {
        // Création d'une nouvelle matière
        response = await fetch('http://127.0.0.1:8000/main/ajouteMatiere/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nouvelleMatiere)
        });
      }

      if (!response.ok) {
        throw new Error(editId ? 'Échec de la modification' : 'Échec de la création');
      }

      // Recharger la liste des matières
      const updatedResponse = await fetch('http://127.0.0.1:8000/main/consulerMatiere/');
      const updatedData = await updatedResponse.json();
      setMatieres(updatedData);

      // Réinitialiser le formulaire
      setNouvelleMatiere({
        libelle: "",
      });
      setEditId(null);
      setErreurs({
        libelle: "",
      });
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    }
  };

  const handleEdit = (matiere) => {
    setEditId(matiere.idMatiere);
    setNouvelleMatiere({
      libelle: matiere.libelle,
    });
  };

  const handleDelete = async (idMatiere) => {
    console.log(idMatiere)
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/main/supprimierMatiere/${idMatiere}/`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Échec de la suppression');
        }

        // Recharger la liste des matières
        const updatedResponse = await fetch('http://127.0.0.1:8000/main/consulerMatiere/');
        const updatedData = await updatedResponse.json();
        setMatieres(updatedData);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Échec de la suppression de la matière');
      }
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
      <h2 className="text-center mb-4">Gestion des Matières</h2>

      {/* Formulaire pour ajouter/modifier une matière */}
      <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded shadow-sm bg-light">
        <h5>{editId ? 'Modifier une matière' : 'Ajouter une nouvelle matière'}</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className={`form-control ${erreurs.libelle ? 'is-invalid' : ''}`}
              placeholder="libelle de la matière"
              name="libelle"
              value={nouvelleMatiere.libelle}
              onChange={handleChange}
              required
            />
            {erreurs.libelle && <div className="invalid-feedback">{erreurs.libelle}</div>}
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              {editId ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </form>

      {/* Liste des matières */}
      <table className="table table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>Libelle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matieres.map((matiere) => {

            return (
              <tr key={matiere.idMatiere}>
                <td>{matiere.libelle}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(matiere)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(matiere.idMatiere)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default GestionMatiere;
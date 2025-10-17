import React, { useState, useEffect } from 'react';

const GererComptes = () => {
  const [comptes, setComptes] = useState({
    etudiant: [],
    enseignant: [],
    administrateur: []
  });
  const [form, setForm] = useState({
    cin: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    email: '',
    password: '',
    role: 'Etudiant',
    classeEtudiant: '',
    niveau: '',
    salaire: '',
    poste: ''
  });
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchComptes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/user/consulter_comptes/');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des comptes');
        }
        const data = await response.json();
        setComptes(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setErrorMessage('Échec du chargement des comptes');
        setLoading(false);
      }
    };

    fetchComptes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    const cinRegex = /^\d{8}$/;
    const nameRegex = /^[A-Za-zÀ-ÿ\s'-]{3,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!cinRegex.test(form.cin)) {
      errs.cin = "CIN invalide (8 chiffres requis)";
    } else {
      const duplicateEtudiant = comptes.etudiant.find(c => c.user.CIN === parseInt(form.cin) && c.user.CIN !== editId);
      const duplicateEnseignant = comptes.enseignant.find(c => c.user.CIN === parseInt(form.cin) && c.user.CIN !== editId);
      const duplicateAdmin = comptes.administrateur.find(c => c.user.CIN === parseInt(form.cin) && c.user.CIN !== editId);
      
      if (duplicateEtudiant || duplicateEnseignant || duplicateAdmin) {
        errs.cin = "CIN déjà utilisé";
      }
    }

    if (!nameRegex.test(form.nom)) errs.nom = "Nom invalide (3 lettres minimum)";
    if (!nameRegex.test(form.prenom)) errs.prenom = "Prénom invalide (3 lettres minimum)";
    if (!form.dateNaissance) errs.dateNaissance = "Date requise";
    if (!form.email.includes('@')) errs.email = "Email invalide";
    if (!form.password || !passwordRegex.test(form.password)) {
      errs.password = "Mot de passe invalide (8 caractères min, au moins 1 lettre et 1 chiffre)";
    }

    if (form.role === 'Etudiant' && !form.classeEtudiant) {
      errs.classeEtudiant = "Classe requise";
    }
    if (form.role === 'Enseignant') {
      if (!form.niveau) errs.niveau = "Niveau requis";
      if (!form.salaire || isNaN(form.salaire)) errs.salaire = "Salaire invalide";
    }
    if (form.role === 'Admin' && !form.poste) {
      errs.poste = "Poste requis";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      let endpoint, method, body;
      const commonUserData = {
        CIN: parseInt(form.cin),
        nom: form.nom,
        prenom: form.prenom,
        ddn: form.dateNaissance,
        email: form.email,
        password: form.password,
        role: form.role.toLowerCase()
      };

      if (editId !== null) {
        method = 'PUT';
        endpoint = `http://127.0.0.1:8000/user/modifier_compte/${editId}/`;
        
        if (editType === 'etudiant') {
          body = {
            user: commonUserData,
            classeEtudiant: form.classeEtudiant
          };
        } else if (editType === 'enseignant') {
          body = {
            user: commonUserData,
            niveau: form.niveau,
            salaire: parseFloat(form.salaire)
          };
        } else {
          body = {
            user: commonUserData,
            poste: form.poste
          };
        }
      } else {
        method = 'POST';
        endpoint = 'http://127.0.0.1:8000/user/ajouter_user/';
        
        if (form.role === 'Etudiant') {
          body = {
            user: commonUserData,
            classeEtudiant: form.classeEtudiant
          };
        } else if (form.role === 'Enseignant') {
          body = {
            user: commonUserData,
            niveau: form.niveau,
            salaire: parseFloat(form.salaire)
          };
        } else {
          body = {
            user: commonUserData,
            poste: form.poste
          };
        }
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log(body);
        throw new Error(editId ? 'Échec de la modification' : 'Échec de la création');
      }

      const updatedResponse = await fetch('http://127.0.0.1:8000/user/consulter_comptes/');
      const updatedData = await updatedResponse.json();
      setComptes(updatedData);

      setForm({
        cin: '',
        nom: '',
        prenom: '',
        dateNaissance: '',
        email: '',
        password: '',
        role: 'Etudiant',
        classeEtudiant: '',
        niveau: '',
        salaire: '',
        poste: ''
      });
      setEditId(null);
      setEditType(null);
      setErrors({});
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage(error.message);
    }
  };

  const handleEdit = (compte, type) => {
    setEditId(compte.user.CIN);
    setEditType(type);
    
    const baseForm = {
      cin: compte.user.CIN.toString(),
      nom: compte.user.nom,
      prenom: compte.user.prenom,
      dateNaissance: compte.user.ddn,
      email: compte.user.email,
      password: '', // On ne récupère pas le mot de passe existant pour des raisons de sécurité
      role: compte.user.role.charAt(0).toUpperCase() + compte.user.role.slice(1)
    };

    if (type === 'etudiant') {
      setForm({
        ...baseForm,
        classeEtudiant: compte.classeEtudiant
      });
    } else if (type === 'enseignant') {
      setForm({
        ...baseForm,
        niveau: compte.niveau,
        salaire: compte.salaire.toString()
      });
    } else {
      setForm({
        ...baseForm,
        poste: compte.poste
      });
    }
    
    setErrors({});
  };

  const handleDelete = async (id, type) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/user/delete_user/${id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type })
        });

        if (!response.ok) {
          throw new Error('Échec de la suppression');
        }

        const updatedResponse = await fetch('http://127.0.0.1:8000/user/consulter_comptes/');
        const updatedData = await updatedResponse.json();
        setComptes(updatedData);
      } catch (error) {
        console.error('Erreur:', error);
        setErrorMessage('Échec de la suppression du compte');
      }
    }
  };

  const renderSpecificFields = () => {
    switch (form.role) {
      case 'Etudiant':
        return (
          <div className="col-md-3">
            <input
              type="text"
              className={`form-control ${errors.classeEtudiant ? 'is-invalid' : ''}`}
              placeholder="Classe"
              name="classeEtudiant"
              value={form.classeEtudiant}
              onChange={handleChange}
              required
            />
            {errors.classeEtudiant && <div className="invalid-feedback">{errors.classeEtudiant}</div>}
          </div>
        );
      case 'Enseignant':
        return (
          <>
            <div className="col-md-3">
              <input
                type="text"
                className={`form-control ${errors.niveau ? 'is-invalid' : ''}`}
                placeholder="Niveau"
                name="niveau"
                value={form.niveau}
                onChange={handleChange}
                required
              />
              {errors.niveau && <div className="invalid-feedback">{errors.niveau}</div>}
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className={`form-control ${errors.salaire ? 'is-invalid' : ''}`}
                placeholder="Salaire"
                name="salaire"
                value={form.salaire}
                onChange={handleChange}
                required
              />
              {errors.salaire && <div className="invalid-feedback">{errors.salaire}</div>}
            </div>
          </>
        );
      case 'Admin':
        return (
          <div className="col-md-3">
            <input
              type="text"
              className={`form-control ${errors.poste ? 'is-invalid' : ''}`}
              placeholder="Poste"
              name="poste"
              value={form.poste}
              onChange={handleChange}
              required
            />
            {errors.poste && <div className="invalid-feedback">{errors.poste}</div>}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="container py-4 text-center">Chargement en cours...</div>;
  }

  if (errorMessage) {
    return <div className="container py-4 alert alert-danger">{errorMessage}</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Gestion des Comptes</h2>

      <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded shadow-sm bg-light">
        <h5>{editId ? 'Modifier un compte' : 'Ajouter un compte'}</h5>
        <div className="row g-3">
          <div className="col-md-2">
            <input
              type="text"
              className={`form-control ${errors.cin ? 'is-invalid' : ''}`}
              placeholder="CIN"
              name="cin"
              value={form.cin}
              onChange={handleChange}
              required
            />
            {errors.cin && <div className="invalid-feedback">{errors.cin}</div>}
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
              placeholder="Nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
            />
            {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
              placeholder="Prénom"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              required
            />
            {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className={`form-control ${errors.dateNaissance ? 'is-invalid' : ''}`}
              name="dateNaissance"
              value={form.dateNaissance}
              onChange={handleChange}
              required
            />
            {errors.dateNaissance && <div className="invalid-feedback">{errors.dateNaissance}</div>}
          </div>
          <div className="col-md-2">
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="col-md-2">
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Mot de passe"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="Etudiant">Étudiant</option>
              <option value="Enseignant">Enseignant</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          {renderSpecificFields()}
          
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              {editId ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </form>

      <div className="mb-4">
        <h4>Étudiants</h4>
        <table className="table table-bordered table-hover mb-5">
          <thead className="table-light">
            <tr>
              <th>CIN</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Date de naissance</th>
              <th>Email</th>
              <th>Classe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comptes.etudiant.map((etudiant) => (
              <tr key={etudiant.user.CIN}>
                <td>{etudiant.user.CIN}</td>
                <td>{etudiant.user.nom}</td>
                <td>{etudiant.user.prenom}</td>
                <td>{etudiant.user.ddn}</td>
                <td>{etudiant.user.email}</td>
                <td>{etudiant.classeEtudiant}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(etudiant, 'etudiant')}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(etudiant.user.CIN, 'etudiant')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4>Enseignants</h4>
        <table className="table table-bordered table-hover mb-5">
          <thead className="table-light">
            <tr>
              <th>CIN</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Date de naissance</th>
              <th>Email</th>
              <th>Niveau</th>
              <th>Salaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comptes.enseignant.map((enseignant) => (
              <tr key={enseignant.user.CIN}>
                <td>{enseignant.user.CIN}</td>
                <td>{enseignant.user.nom}</td>
                <td>{enseignant.user.prenom}</td>
                <td>{enseignant.user.ddn}</td>
                <td>{enseignant.user.email}</td>
                <td>{enseignant.niveau}</td>
                <td>{enseignant.salaire}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(enseignant, 'enseignant')}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(enseignant.user.CIN, 'enseignant')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4>Administrateurs</h4>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>CIN</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Date de naissance</th>
              <th>Email</th>
              <th>Poste</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comptes.administrateur.map((admin) => (
              <tr key={admin.user.CIN}>
                <td>{admin.user.CIN}</td>
                <td>{admin.user.nom}</td>
                <td>{admin.user.prenom}</td>
                <td>{admin.user.ddn}</td>
                <td>{admin.user.email}</td>
                <td>{admin.poste}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(admin, 'administrateur')}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(admin.user.CIN, 'administrateur')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GererComptes;
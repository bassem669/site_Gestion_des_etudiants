import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const GestionEnseignements = () => {
    const [enseignements, setEnseignements] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        enseignant: '',
        matiere: '',
        classeEnseignant: '',
        jour: '',
        heureDepart: ''
    });
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Récupérer les données initiales
    useEffect(() => {
        // Liste des enseignements
        fetchEnseignements();

        // Liste des enseignants
        axios.get('http://localhost:8000/user/getAllEnsiegnemant/')
            .then(response => setEnseignants(response.data))
            .catch(() => setError('Erreur lors du chargement des enseignants'));

        // Liste des matières
        axios.get('http://localhost:8000/main/consulerMatiere/')
            .then(response => setMatieres(response.data))
            .catch(() => setError('Erreur lors du chargement des matières'));

        // Liste des classes
        axios.get('http://localhost:8000/main/consulerClass/')
            .then(response => setClasses(response.data))
            .catch(() => setError('Erreur lors du chargement des classes'));
    }, []);

    const fetchEnseignements = () => {
        axios.get('http://localhost:8000/main/consulerEnseignement/')
            .then(response => setEnseignements(response.data))
            .catch(() => setError('Erreur lors du chargement des enseignements'));
    }

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Soumettre le formulaire (ajout ou modification)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        formData.matiere = matieres.find(m => m.libelle === formData.matiere)?.idMatiere
        try {
            if (editId) {
                console.log(formData);
                // Modification
                const response = await axios.put('http://localhost:8000/main/consulerEnseignement/', {
                    ...formData,
                });
                setMessage(response.data.msg);
                setEnseignements(enseignements.map(ens => 
                    ens.enseignant === formData.enseignant && ens.matiere === formData.matiere ? response.data : ens
                ));
                setEditId(null);
            } else {
                // Ajout

                const response = await axios.post('http://localhost:8000/main/consulerEnseignement/', formData);
                setMessage(response.data.msg);
                setEnseignements([...enseignements, response.data]);
            }
            setFormData({ enseignant: '', matiere: '', classeEnseignant: '', jour: '', heureDepart: '' });
            fetchEnseignements();
        } catch (err) {
            setError(err.response?.data?.errors || err.response?.data?.error || 'Une erreur s\'est produite');
        }
    };

    // Supprimer un enseignement
    const handleDelete = async (enseignant, matiere) => {
        try {
            const response = await axios.delete('http://localhost:8000/main/consulerEnseignement/', {
                data: { enseignant, matiere }
            });
            setMessage(response.data.message);
            setEnseignements(enseignements.filter(ens => 
                ens.enseignant !== enseignant || ens.matiere !== matiere
            ));
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const getEnsiegnant = (id) => {
        const enseignant = enseignants.find(m => m.user.CIN === id);
        if (!enseignant) {
            return 'Enseignant inconnu';
        }
        const nom = enseignant.user.nom;
        const prenom = enseignant.user.prenom;
        return nom + ' ' + prenom;
    }
    // Modifier un enseignement
    const handleEdit = (enseignement) => {
        setFormData({
            enseignant: enseignement.enseignant,
            matiere: enseignement.libelleMatiere,
            classeEnseignant: enseignement.classeEnseignant,
            jour: enseignement.jour,
            heureDepart: enseignement.heureDepart
        });
        setEditId({ enseignant: enseignement.enseignant, matiere: enseignement.matiere });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Gestion des Enseignements</h2>
            {message && <div className="alert alert-success" role="alert">{message}</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            {/* Formulaire */}
            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="card-title">{editId ? 'Modifier' : 'Ajouter'} un enseignement</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="enseignant" className="form-label">Enseignant</label>
                            <select
                                name="enseignant"
                                value={formData.enseignant}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="">Sélectionner un enseignant</option>
                                {enseignants.map(ens => (
                                    <option key={ens.user.CIN} value={ens.user.CIN}>
                                        {ens.user.nom} {ens.user.prenom} ({ens.user.CIN})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="matiere" className="form-label">Matière</label>
                            <select
                                name="matiere"
                                value={formData.matiere}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option >
                                        Selectionner un cours
                                    </option>
                                {matieres.map((mat, index) => (
                                    <option key={index} value={mat.libelle}>
                                        {mat.libelle}
                                    </option>
                                ))}

                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="classeEnseignant" className="form-label">Classe</label>
                            <select
                                name="classeEnseignant"
                                value={formData.classeEnseignant}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="">Sélectionner une classe</option>
                                {classes.map(classe => (
                                    <option key={classe.nomClass} value={classe.nomClass}>
                                        {classe.nomClass}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="jour" className="form-label">Jour</label>
                            <select
                                name="jour"
                                value={formData.jour}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="">Sélectionner un jour</option>
                                <option value="Lundi">Lundi</option>
                                <option value="Mardi">Mardi</option>
                                <option value="Mercredi">Mercredi</option>
                                <option value="Jeudi">Jeudi</option>
                                <option value="Vendredi">Vendredi</option>
                                <option value="Samedi">Samedi</option>
                                <option value="Dimanche">Dimanche</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="heureDepart" className="form-label">Heure de début</label>
                            <input
                                type="time"
                                name="heureDepart"
                                value={formData.heureDepart}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            {editId ? 'Modifier' : 'Ajouter'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Tableau des enseignements */}
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Liste des enseignements</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Enseignant</th>
                                <th>Matière</th>
                                <th>Classe</th>
                                <th>Jour</th>
                                <th>Heure</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enseignements.map(ens => (
                                
                                <tr key={`${ens.enseignant}-${ens.libelleMatiere}`}>

                                    <td>{getEnsiegnant(ens.enseignant)}</td>
                                    <td>{ens.libelleMatiere}</td>
                                    <td>{ens.classeEnseignant}</td>
                                    <td>{ens.jour}</td>
                                    <td>{ens.heureDepart}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(ens)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(ens.enseignant.user.CIN, ens.matiere.libelle)}
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
        </div>
    );
};

export default GestionEnseignements;
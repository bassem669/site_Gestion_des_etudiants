import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AffecterEtudiant = () => {
    const [etudiants, setEtudiants] = useState([]);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        CIN: '',
        nomClass: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Récupérer la liste des étudiants
    useEffect(() => {
        axios.get('http://localhost:8000/user/getAllEtudiant/')
            .then(response => setEtudiants(response.data))
            .catch(error => setError("Erreur lors du chargement des étudiants"));
    }, []);

    // Récupérer la liste des classes
    useEffect(() => {
        axios.get('http://localhost:8000/main/consulerClass/')
            .then(response => setClasses(response.data))
            .catch(error => setError("Erreur lors du chargement des classes"));
    }, []);

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Soumettre le formulaire pour affecter un étudiant
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.put('http://localhost:8000/user/affecterEtudiant/', formData);
            console.log(response)
            console.log(formData)
            setMessage(`Étudiant affecté avec succès à la classe ${response.data.classeEtudiant}`);
        } catch (err) {
            setError(err.response?.data?.msg || "Une erreur s'est produite");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Affecter un étudiant à une classe</h2>
                            {message && <div className="alert alert-success" role="alert">{message}</div>}
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="CIN" className="form-label">Étudiant (CIN)</label>
                                    <select
                                        name="CIN"
                                        value={formData.CIN}
                                        onChange={handleChange}
                                        className="form-select"
                                        id="CIN"
                                        required
                                    >
                                        <option value="">Sélectionner un étudiant</option>
                                        {etudiants.map(etudiant => (
                                            <option key={etudiant.user.CIN} value={etudiant.user.CIN}>
                                                {etudiant.user.nom} {etudiant.user.prenom} ({etudiant.user.CIN})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nomClass" className="form-label">Classe</label>
                                    <select
                                        name="nomClass"
                                        value={formData.nomClass}
                                        onChange={handleChange}
                                        className="form-select"
                                        id="nomClass"
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
                                <button type="submit" className="btn btn-primary w-100">
                                    Affecter
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffecterEtudiant;
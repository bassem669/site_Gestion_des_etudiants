import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";

import MarquerNote from "./components/Enseignant/MarquerNote";
import MarquerAbsence from "./components/Enseignant/MarquerAbsence";
import ConsulterAbsence from "./components/Etudiant/ConsulterAbsence";
import ConsulterNote from "./components/Etudiant/ConsulterNotes";
import GererComptes from "./components/Admin/GererComptes";
import ListeAbsencesEtudiants from "./components/Admin/ListeAbsencesEtudiants";
import ListeNotesEtudiants from "./components/Admin/ListeNotesEtudiants";
import Profil from "./components/Profil";
import GererClasses from "./components/Admin/GererClasses";
import GererMatieres from "./components/Admin/GererMatiere";
import Login from "./components/Login";
import AffecterEtudiant from "./components/Admin/AffecterEtudiant";
import GestionEnseignements from "./components/Admin/GestionEnseignements";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />}>
            <Route path="marquer-absence" element={<MarquerAbsence />} />
            <Route path="marquer-note" element={<MarquerNote />} />
            <Route path="consulter-note" element={<ConsulterNote />} />
            <Route path="consulter-absence" element={<ConsulterAbsence />} />
            <Route path="listeAbsence" element={<ListeAbsencesEtudiants />} />
            <Route path="listeNote" element={<ListeNotesEtudiants />} />
            <Route path="gererComptes" element={<GererComptes />} />
            <Route path="affecterEtudiant" element={<AffecterEtudiant />} />
            <Route path="gestionEnseignements" element={<GestionEnseignements />} />
            <Route path="gererClasses" element={<GererClasses />} />
             <Route path="gererMatieres" element={<GererMatieres />} />
            <Route path="profil" element={<Profil />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

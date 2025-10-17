import React from 'react';
import '../../App.css';
import { Link } from "react-router-dom";


const NavBarAdmin = ({ col }) => {
  return (
    <div className="nav flex-column">
      <Link to="/gererComptes" className="sidebar-link text-decoration-none p-3">
  <i className="fas fa-user-cog me-3"></i>
  {!col && <span>Gérer les comptes</span>}
</Link>

<Link to="/gererClasses" className="sidebar-link text-decoration-none p-3">
  <i className="fas fa-chalkboard me-3"></i>
  {!col && <span>Gérer les classes</span>}
</Link>

<Link to="/gererMatieres" className="sidebar-link text-decoration-none p-3">
  <i className="fas fa-book me-3"></i>
  {!col && <span>Gérer les matières</span>}
</Link>

<Link to="/gestionEnseignements" className="sidebar-link text-decoration-none p-3">
  <i className="fas fa-chalkboard me-3"></i>
  {!col && <span>Gérer les Enseignements</span>}
</Link>

<Link to="/affecterEtudiant" className="sidebar-link text-decoration-none p-3">
  <i className="fas fa-user-cog me-3"></i>
  {!col && <span>Affecter Etudiant</span>}
</Link>

<Link to="/listeNote" className="sidebar-link text-decoration-none p-3">
  <i className="fas fa-file-alt me-3"></i>
  {!col && <span>Consulter les notes</span>}
</Link>

<Link to="/listeAbsence" className="sidebar-link text-decoration-none p-3">
  <i className="fas fa-calendar-times me-3"></i>
  {!col && <span>Consulter les absences</span>}
</Link>

    </div>
  );
};

export default NavBarAdmin;

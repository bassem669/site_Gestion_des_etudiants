import React from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';

const NavBarEtudiant = ({ col }) => {
  return (
    <div className="nav flex-column">
      <Link to="/consulter-note" className="sidebar-link text-decoration-none p-3">
  <i className="fas fa-file-alt me-3"></i>
  {!col && <span>Consulter les notes</span>}
</Link>

<Link to="/consulter-absence" className="sidebar-link text-decoration-none p-3">
  <i className="fas fa-calendar-times me-3"></i>
  {!col && <span>Consulter les absences</span>}
</Link>

    </div>
  );
};

export default NavBarEtudiant;

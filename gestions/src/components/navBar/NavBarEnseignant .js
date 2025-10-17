import React from 'react';
import '../../App.css';
import { Link } from "react-router-dom";

const NavBarEnseignant = ({ col }) => {
  return (
    <div className="nav flex-column">
      <Link to="/marquer-note" className="sidebar-link text-decoration-none p-3">
        <i className="fas fa-pen-alt me-3"></i>
        {!col && <span>Marquer les notes</span>}
      </Link>
      <Link to="/marquer-absence" className="sidebar-link text-decoration-none p-3">
        <i className="fas fa-user-check me-3"></i>
        {!col && <span>Marquer les absences</span>}
      </Link>
    </div>
    
  );
};

export default NavBarEnseignant;

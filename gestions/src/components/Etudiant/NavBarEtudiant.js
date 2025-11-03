
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Ajout useNavigate
import './../../App.css';

const NavBarEtudiant = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // ✅
  const user = JSON.parse(localStorage.getItem('user'));


  const role = localStorage.getItem('role');


  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');        
    localStorage.removeItem('role');         
    navigate('/');   
    window.location.reload();                   
  };


  const renderProfil = () => {
    return (
      <div>
        <Link to="/espaceEtudiant/profil" className="text-decoration-none">
          <div className="ms-3 profile-info">
            <h6 className="text-white mb-0">{user.user.nom}</h6>
            <small className="text-light">{role}</small>
          </div>
        </Link>
        <button onClick={handleLogout} className="btn btn-outline-light mt-3 w-100">
          <i className="fas fa-sign-out-alt me-2"></i>
          Déconnexion
        </button>
      </div>
    );
  };

  return (
    <nav className={`sidebar d-flex flex-column flex-shrink-0 position-fixed ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
      </button>

      <div className="p-4">
        {!collapsed && <h4 className="logo-text fw-bold mb-0">NOM DE L'INSTITUT</h4>}
      </div>

      <div className="nav flex-column">
        <Link to="/espaceEtudiant/consulter-note" className="sidebar-link text-decoration-none p-3">
          <i className="fas fa-file-alt me-3"></i>
          {!collapsed && <span>Consulter les notes</span>}
        </Link>

        <Link to="/espaceEtudiant/consulter-absence" className="sidebar-link text-decoration-none p-3">
          <i className="fas fa-calendar-times me-3"></i>
          {!collapsed && <span>Consulter les absences</span>}
        </Link>
      </div>

      <div className="profile-section mt-auto p-4">
        <div className="d-flex align-items-center">
          {!collapsed && renderProfil()}
        </div>
      </div>
    </nav>
  );
};

export default NavBarEtudiant;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Ajout useNavigate
import '../App.css';
import NavBarEtudiant from './navBar/NavBarEtudiant';
import NavBarEnseignant from './navBar/NavBarEnseignant ';
import NavBarAdmin from './navBar/NavBarAdmin ';

const NavBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // ✅
  const user = JSON.parse(localStorage.getItem('user'));


  const role = localStorage.getItem('role');


  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');        // ou 'user', selon ta logique
    localStorage.removeItem('role');         // si stocké
    navigate('/');   
    window.location.reload();                   // redirection vers /login
  };

  const renderNavBar = () => {
    if (role === "admin") {
      return <NavBarAdmin col={collapsed} />;
    }
    if (role === "enseignant") {
      return <NavBarEnseignant col={collapsed} />;
    }
    return <NavBarEtudiant col={collapsed} />;
  };

  const renderProfil = () => {
    return (
      <div>
        <Link to="/profil" className="text-decoration-none">
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

      {renderNavBar()}

      <div className="profile-section mt-auto p-4">
        <div className="d-flex align-items-center">
          {!collapsed && renderProfil()}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

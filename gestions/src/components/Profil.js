import React, { useState } from 'react';

const Profil = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  

  

  

  return (
    <div className="container py-5">
      <h2 className="mb-4">User Settings</h2>
      <form >
        <div className="row mb-4">
          <div className="col-md-6">
            <h4>Personal Information</h4>
            <div className="mb-3">
              <label htmlFor="CIN" className="form-label">CIN</label>
              <input
                type="number"
                className="form-control"
                id="CIN"
                value={user.user.CIN}
                
                required
                minLength={8}
                maxLength={8}
              />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Nom Complet</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                value={user.user.nom}
                
                required
                minLength={3}
                pattern="[A-Za-zÀ-ÿ\s]+"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">Date de naissance</label>
              <input
                type="date"
                className="form-control"
                id="dob"
                value={user.user.dob}
                
                required
              />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={user.user.email}
                
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </div>
          </div>
        </div>

        <hr />

        <div className="row mb-4">
          <h4>Change Password</h4>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                value=""
                
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value=""
                
                required
                minLength={8}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$" // Validation du mot de passe
              />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value=""
                
                required
                minLength={8}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$" // Validation du mot de passe
              />
            </div>
          </div>
        </div>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="button" className="btn btn-secondary me-md-2">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default Profil;

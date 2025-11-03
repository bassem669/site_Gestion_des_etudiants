import React, { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // 👈 hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/user/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));

        
      navigate(data.redir);

      } else {
        setErrorMsg(data.error || 'Erreur de connexion');
      }
    } catch {
      setErrorMsg('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg w-100" style={{ maxWidth: '480px' }}>
        <div className="card-body">
          <div className="text-center">
            <h1 className="card-title h3">Sign in</h1>
            <p className="card-text text-muted">Sign in below to access your account</p>
          </div>
          <div className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label text-muted">Email Address</label>
                <input type="email" className="form-control" id="email"
                       value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label text-muted">Password</label>
                <input type="password" className="form-control" id="password"
                       value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-dark btn-lg">Sign in</button>
              </div>
              {errorMsg && <p className="text-danger mt-3 text-center">{errorMsg}</p>}
              <br />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

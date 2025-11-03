import '../App.css';
import React from 'react';
import Login from './Login'
import { Outlet } from 'react-router-dom';
import NavBarEnseignant from './Enseignant/NavBarEnseignant ';

function HomeEnseignant() {

  const user = JSON.parse(localStorage.getItem('user'));
  const isLogin = () => {
    if(user !== null){
      return (
          <div className="d-flex">
          <NavBarEnseignant />
            <main className="main-content flex-grow-1">
              <div className="container-fluid p-4">
                <Outlet />
              </div>
            </main>
          </div>
    );
    }
    return <Login />;
  }

  return (
    <div className="App">
      {isLogin()}
    </div>

  );
}

export default HomeEnseignant;
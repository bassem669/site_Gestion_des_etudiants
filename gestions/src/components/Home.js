import '../App.css';
import NavBar from './NavBar';
import React from 'react';
import Login from './Login'
import { Outlet } from 'react-router-dom';

function Home() {

  const user = JSON.parse(localStorage.getItem('user'));
  const isLogin = () => {
    if(user !== null){
      return (
          <div className="d-flex">
          <NavBar />
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

export default Home;

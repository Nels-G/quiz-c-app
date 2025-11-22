import React from 'react';
import './Navbar.css';

const Navbar = ({ userName = "Utilisateur", niveau = "Débutant", score = 0 }) => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <div className="navbar-title">
          <h1>QCM Langage C</h1>
          <p>Apprendre en s'amusant</p>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-user-info">
          <span className="navbar-user-name">{userName}</span>
          <span className="navbar-user-niveau">{niveau}</span>
        </div>
        <div className="navbar-score">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="5" />
            <path d="M12 13v8" />
            <path d="M9 18h6" />
          </svg>
          <span>{score}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [niveau, setNiveau] = useState('');

  const niveaux = [
    {
      id: 'debutant',
      icon: '🎓',
      title: 'Débutant',
      description: 'Les bases du C',
      color: '#14b8a6'
    },
    {
      id: 'intermediaire',
      icon: '◎',
      title: 'Intermédiaire',
      description: 'Structures et pointeurs',
      color: '#3b82f6'
    },
    {
      id: 'avance',
      icon: '⚡',
      title: 'Avancé',
      description: 'Gestion mémoire avancée',
      color: '#d946ef'
    }
  ];

  const handleSubmit = () => {
    console.log({ prenom, nom, niveau });
  };

  return (
    <div className="Home-container">
      <div className="Home-card">
        <div className="Home-icon-wrapper">
          <div className="Home-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3L1 9l11 6 9-4.91V17M5 13.18v4L12 21l7-3.82v-4" />
            </svg>
          </div>
        </div>

        <h1 className="Home-title">Bienvenue !</h1>
        <p className="Home-subtitle">Commençons votre aventure d'apprentissage du langage C</p>

        <div className="Home-form">
          <div className="Home-input-group">
            <div className="Home-input-wrapper">
              <label className="Home-label">Prénom</label>
              <input
                type="text"
                className="Home-input"
                placeholder="Votre prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
            </div>
            <div className="Home-input-wrapper">
              <label className="Home-label">Nom</label>
              <input
                type="text"
                className="Home-input"
                placeholder="Votre nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>
          </div>

          <div className="Home-niveau-section">
            <label className="Home-label">Choisissez votre niveau</label>
            <div className="Home-niveau-options">
              {niveaux.map((n) => (
                <div
                  key={n.id}
                  className={`Home-niveau-card ${niveau === n.id ? 'Home-niveau-card--selected' : ''}`}
                  onClick={() => setNiveau(n.id)}
                >
                  <div 
                    className="Home-niveau-icon" 
                    style={{ backgroundColor: n.color }}
                  >
                    {n.id === 'debutant' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 3L1 9l11 6 9-4.91V17M5 13.18v4L12 21l7-3.82v-4" />
                      </svg>
                    )}
                    {n.id === 'intermediaire' && (
                      <svg viewBox="0 0 24 24" fill="white">
                        <circle cx="12" cy="12" r="3" />
                        <circle cx="12" cy="12" r="8" fill="none" stroke="white" strokeWidth="2" />
                      </svg>
                    )}
                    {n.id === 'avance' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    )}
                  </div>
                  <span className="Home-niveau-title">{n.title}</span>
                  <span className="Home-niveau-description">{n.description}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="Home-button" onClick={handleSubmit}>
            Commencer le Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
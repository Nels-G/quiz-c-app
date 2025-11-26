import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import apiService from '../../services/api';

const Home = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [niveau, setNiveau] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const validateForm = () => {
    const newErrors = {};

    if (!prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (prenom.trim().length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!niveau) {
      newErrors.niveau = 'Veuillez sélectionner un niveau';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await apiService.createUserSession({
        first_name: prenom.trim(),
        last_name: nom.trim(),
        level: niveau
      });

      navigate('/accueil');
    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ submit: 'Erreur lors du démarrage du quiz. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrenomChange = (e) => {
    setPrenom(e.target.value);
    if (errors.prenom) {
      setErrors(prev => ({ ...prev, prenom: '' }));
    }
  };

  const handleNomChange = (e) => {
    setNom(e.target.value);
    if (errors.nom) {
      setErrors(prev => ({ ...prev, nom: '' }));
    }
  };

  const handleNiveauChange = (niveauId) => {
    setNiveau(niveauId);
    if (errors.niveau) {
      setErrors(prev => ({ ...prev, niveau: '' }));
    }
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
                className={`Home-input ${errors.prenom ? 'Home-input--error' : ''}`}
                placeholder="Votre prénom"
                value={prenom}
                onChange={handlePrenomChange}
              />
              {errors.prenom && <span className="Home-error">{errors.prenom}</span>}
            </div>
            <div className="Home-input-wrapper">
              <label className="Home-label">Nom</label>
              <input
                type="text"
                className={`Home-input ${errors.nom ? 'Home-input--error' : ''}`}
                placeholder="Votre nom"
                value={nom}
                onChange={handleNomChange}
              />
              {errors.nom && <span className="Home-error">{errors.nom}</span>}
            </div>
          </div>

          <div className="Home-niveau-section">
            <label className="Home-label">Choisissez votre niveau</label>
            {errors.niveau && <span className="Home-error">{errors.niveau}</span>}
            <div className="Home-niveau-options">
              {niveaux.map((n) => (
                <div
                  key={n.id}
                  className={`Home-niveau-card ${niveau === n.id ? 'Home-niveau-card--selected' : ''} ${errors.niveau ? 'Home-niveau-card--error' : ''}`}
                  onClick={() => handleNiveauChange(n.id)}
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
                  <div className="Home-niveau-content">
                    <span className="Home-niveau-title">{n.title}</span>
                    <span className="Home-niveau-description">{n.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {errors.submit && (
            <div className="Home-error-message">
              {errors.submit}
            </div>
          )}

          <button 
            className="Home-button" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Commencer le Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, XCircle, Trophy, Clock, Home, BarChart3 } from 'lucide-react';
import './result.css';

const Result = ({ onCelebrationComplete }) => {
  const [animated, setAnimated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Données du résultat
  const resultData = {
    score: 80.0,
    correctes: 16,
    incorrectes: 4,
    jetons: 75,
    temps: '4min 35s',
    rating: 'Excellent'
  };

  const isGoodResult = resultData.score >= 70;

  useEffect(() => {
    // Déclencher l'animation de la carte
    setTimeout(() => setAnimated(true), 100);
    
    // Si bon résultat, lancer les confettis
    if (isGoodResult) {
      setTimeout(() => setShowConfetti(true), 800);
      
      // Après 3 secondes de feux d'artifice, les arrêter
      setTimeout(() => {
        setShowConfetti(false);
      }, 3800);
      
      // Puis notifier que la célébration est terminée pour afficher la popup
      setTimeout(() => {
        if (onCelebrationComplete) {
          onCelebrationComplete();
        }
      }, 4000);
    } else {
      // Si mauvais résultat, pas de célébration, notifier rapidement
      setTimeout(() => {
        if (onCelebrationComplete) {
          onCelebrationComplete();
        }
      }, 2000);
    }
  }, [isGoodResult, onCelebrationComplete]);

  return (
    <div className="result-container">
      <div className={`result-card ${animated ? 'result-card-animated' : ''}`}>
        <div className="result-icon">
          <Award />
        </div>

        <h1 className="result-title">Félicitations !</h1>

        <div className="result-rating-wrapper">
          <div className="result-rating">
            <span className="result-rating-text">{resultData.rating}</span>
          </div>
        </div>

        <div className="result-stats">
          <div className="result-stat-card result-stat-score">
            <div className="result-stat-value">{resultData.score}%</div>
            <div className="result-stat-label">Score</div>
          </div>

          <div className="result-stat-card result-stat-correct">
            <div className="result-stat-icon">
              <CheckCircle size={24} color="#2e7d32" />
            </div>
            <div className="result-stat-value">{resultData.correctes}</div>
            <div className="result-stat-label">Correctes</div>
          </div>

          <div className="result-stat-card result-stat-incorrect">
            <div className="result-stat-icon">
              <XCircle size={24} color="#c62828" />
            </div>
            <div className="result-stat-value">{resultData.incorrectes}</div>
            <div className="result-stat-label">Incorrectes</div>
          </div>
        </div>

        <div className="result-details">
          <div className="result-detail-card">
            <div className="result-detail-icon">
              <Trophy />
            </div>
            <div className="result-detail-content">
              <div className="result-detail-value result-detail-value-positive">+{resultData.jetons}</div>
              <div className="result-detail-label">Jetons gagnés</div>
            </div>
          </div>

          <div className="result-detail-card">
            <div className="result-detail-icon result-detail-icon-time">
              <Clock />
            </div>
            <div className="result-detail-content">
              <div className="result-detail-value">{resultData.temps}</div>
              <div className="result-detail-label">Temps total</div>
            </div>
          </div>
        </div>

        <div className="result-actions">
          <button className="result-button result-button-secondary">
            <Home size={20} />
            Accueil
          </button>
          <button className="result-button result-button-primary">
            <BarChart3 size={20} />
            Classement
          </button>
        </div>
      </div>

      {/* Confettis pour les bons résultats */}
      {showConfetti && isGoodResult && (
        <>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="result-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                background: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#4caf50', '#ffeb3b', '#ff9800'][i % 10],
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${2 + Math.random() * 1}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Étoiles scintillantes pour bon résultat */}
      {showConfetti && isGoodResult && (
        <>
          {[...Array(15)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="result-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            >
              ⭐
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Result;
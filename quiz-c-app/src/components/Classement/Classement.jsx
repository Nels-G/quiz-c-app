import React from 'react';
import './Classement.css';
import { Trophy, Home, RefreshCw, Medal } from 'lucide-react';

const Classement = () => {
  // Données de démonstration
  const users = [
    { id: 1, name: 'nil Galley', isCurrentUser: true, level: 'Débutant', quizzes: 1, average: 80.0, score: 75, rank: 1 },
    { id: 2, name: 'Sarah Martin', isCurrentUser: false, level: 'Intermédiaire', quizzes: 5, average: 92.5, score: 250, rank: 2 },
    { id: 3, name: 'Ahmed Ben', isCurrentUser: false, level: 'Expert', quizzes: 12, average: 88.3, score: 180, rank: 3 },
    { id: 4, name: 'Julie Dubois', isCurrentUser: false, level: 'Intermédiaire', quizzes: 8, average: 85.0, score: 165, rank: 4 },
    { id: 5, name: 'Marc Lefebvre', isCurrentUser: false, level: 'Débutant', quizzes: 3, average: 78.5, score: 95, rank: 5 },
    { id: 6, name: 'Emma Wilson', isCurrentUser: false, level: 'Expert', quizzes: 15, average: 94.2, score: 310, rank: 6 },
    { id: 7, name: 'Lucas Roy', isCurrentUser: false, level: 'Intermédiaire', quizzes: 6, average: 81.7, score: 140, rank: 7 },
    { id: 8, name: 'Fatima Azzam', isCurrentUser: false, level: 'Débutant', quizzes: 2, average: 75.0, score: 60, rank: 8 },
  ];

  const getRankDisplay = (rank) => {
    if (rank === 1) return { icon: '🥇', color: '#FFD700' };
    if (rank === 2) return { icon: '🥈', color: '#C0C0C0' };
    if (rank === 3) return { icon: '🥉', color: '#CD7F32' };
    return { icon: rank, color: '#6c757d' };
  };

  return (
    <div className="Classement-container">
      <div className="Classement-card">
        <div className="Classement-header">
          <div className="Classement-icon-wrapper">
            <Trophy className="Classement-trophy-icon" size={32} />
          </div>
          <div className="Classement-title-section">
            <h1 className="Classement-title">Classement Général</h1>
            <p className="Classement-subtitle">Les meilleurs étudiants</p>
          </div>
          <button className="Classement-refresh-btn">
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="Classement-list">
          {users.map((user) => {
            const rankDisplay = getRankDisplay(user.rank);
            return (
              <div 
                key={user.id} 
                className={`Classement-user-row ${user.isCurrentUser ? 'Classement-user-row--current' : ''}`}
              >
                <div className="Classement-rank" style={{ color: rankDisplay.color }}>
                  {rankDisplay.icon}
                </div>
                
                <div className="Classement-user-avatar">
                  <Trophy size={20} />
                </div>
                
                <div className="Classement-user-content">
                  <div className="Classement-user-top">
                    <span className="Classement-user-name">{user.name}</span>
                    {user.isCurrentUser && <span className="Classement-badge">Vous</span>}
                  </div>
                  <div className="Classement-user-bottom">
                    <span className="Classement-level">{user.level}</span>
                    <span className="Classement-stat">{user.quizzes} quiz</span>
                    <span className="Classement-stat">Moy: {user.average}%</span>
                  </div>
                </div>
                
                <div className="Classement-score-block">
                  <Trophy className="Classement-score-icon" size={18} />
                  <span className="Classement-score">{user.score}</span>
                </div>
              </div>
            );
          })}
        </div>

        <button className="Classement-home-btn">
          <Home size={20} />
          <span>Retour à l'accueil</span>
        </button>
      </div>
    </div>
  );
};

export default Classement;
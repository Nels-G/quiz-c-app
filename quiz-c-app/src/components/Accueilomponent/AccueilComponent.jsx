import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, TrendingUp, Calendar, FileText, PlayCircle } from 'lucide-react';
import './AccueilComponent.css';
import CorrectionModal from '../Modal/CorrectionModal';
import apiService from '../../services/api';

const AccueilComponent = () => {
  const [showCorrection, setShowCorrection] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const quizHistory = [
    { id: 1, score: '12/15 (80%)', date: '20 novembre 2025', time: '18 min', status: 'good' },
    { id: 2, score: '14/15 (93%)', date: '18 novembre 2025', time: '15 min', status: 'excellent' },
    { id: 3, score: '10/15 (67%)', date: '15 novembre 2025', time: '22 min', status: 'average' }
  ];

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const quiz = await apiService.generateQuiz('debutant');
      navigate('/quiz', { state: { quiz } });
    } catch (error) {
      console.error('Erreur génération quiz:', error);
      alert('Erreur lors du démarrage du quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleShowCorrection = (quiz) => {
    setSelectedQuiz(quiz);
    setShowCorrection(true);
  };

  return (
    <div className="accueil-container">
      <div className="accueil-content">
        {/* Hero Section */}
        <div className="accueil-hero">
          <div className="accueil-hero-icon">
            <BookOpen size={40} />
          </div>
          <h1 className="accueil-hero-title">Quiz C — Teste tes connaissances en C</h1>
          <p className="accueil-hero-subtitle">Améliore tes compétences en programmation C avec des quiz interactifs</p>
          <button 
            className="accueil-hero-button"
            onClick={handleStartQuiz}
            disabled={loading}
          >
            <PlayCircle size={20} />
            {loading ? 'Génération du quiz...' : 'Commencer un nouveau quiz'}
          </button>
        </div>

        {/* Quiz Overview Card */}
        <div className="accueil-overview">
          <div className="accueil-overview-header">
            <FileText size={24} />
            <h2 className="accueil-overview-title">Aperçu du Quiz</h2>
          </div>

          <div className="accueil-overview-stats">
            <div className="accueil-stat-item">
              <div className="accueil-stat-icon accueil-stat-icon-questions">
                <FileText size={28} />
              </div>
              <div className="accueil-stat-content">
                <div className="accueil-stat-value">15</div>
                <div className="accueil-stat-label">Questions</div>
              </div>
            </div>

            <div className="accueil-stat-item">
              <div className="accueil-stat-icon accueil-stat-icon-time">
                <Clock size={28} />
              </div>
              <div className="accueil-stat-content">
                <div className="accueil-stat-value">20 min</div>
                <div className="accueil-stat-label">Durée estimée</div>
              </div>
            </div>

            <div className="accueil-stat-item">
              <div className="accueil-stat-icon accueil-stat-icon-level">
                <TrendingUp size={28} />
              </div>
              <div className="accueil-stat-content">
                <div className="accueil-stat-value">Moyen</div>
                <div className="accueil-stat-label">Niveau de difficulté</div>
              </div>
            </div>
          </div>

          <button 
            className="accueil-start-button"
            onClick={handleStartQuiz}
            disabled={loading}
          >
            <PlayCircle size={22} />
            {loading ? 'Chargement...' : 'Démarrer le quiz'}
          </button>
        </div>

        {/* Quiz History */}
        <div className="accueil-history">
          <div className="accueil-history-header">
            <Calendar size={24} />
            <h2 className="accueil-history-title">Historique des Quiz Passés</h2>
          </div>

          <div className="accueil-history-list">
            {quizHistory.map((quiz) => (
              <div key={quiz.id} className={`accueil-history-item accueil-history-item--${quiz.status}`}>
                <div className="accueil-history-score">
                  <div className="accueil-history-score-value">{quiz.score}</div>
                </div>
                
                <div className="accueil-history-details">
                  <div className="accueil-history-info">
                    <Calendar size={16} />
                    <span>{quiz.date}</span>
                  </div>
                  <div className="accueil-history-info">
                    <Clock size={16} />
                    <span>{quiz.time}</span>
                  </div>
                </div>

                <button 
                  className="accueil-history-button"
                  onClick={() => handleShowCorrection(quiz)}
                >
                  <FileText size={18} />
                  Voir correction
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CorrectionModal
        isOpen={showCorrection}
        onClose={() => setShowCorrection(false)}
        quizData={selectedQuiz}
      />
    </div>
  );
};

export default AccueilComponent;
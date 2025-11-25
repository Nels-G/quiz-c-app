import React, { useState } from 'react';
import { X, CheckCircle, XCircle, RotateCcw, Download, Maximize2, Minimize2 } from 'lucide-react';
import './CorrectionModal.css';

const CorrectionModal = ({ isOpen, onClose, quizData }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Données de démonstration
  const correction = {
    score: '12/15 (80%)',
    date: '20 novembre 2025',
    time: '18 min',
    questions: [
      {
        id: 1,
        question: "Quelle est la syntaxe correcte pour déclarer un pointeur en C ?",
        userAnswer: "int* ptr;",
        correctAnswer: "int* ptr;",
        isCorrect: true,
        explanation: "La syntaxe int* ptr; est correcte pour déclarer un pointeur vers un entier."
      },
      {
        id: 2,
        question: "Comment allouer dynamiquement de la mémoire pour un tableau de 10 entiers ?",
        userAnswer: "int arr[10];",
        correctAnswer: "int* arr = malloc(10 * sizeof(int));",
        isCorrect: false,
        explanation: "malloc() est utilisé pour l'allocation dynamique. int arr[10]; crée un tableau statique."
      },
      {
        id: 3,
        question: "Quelle fonction permet de libérer la mémoire allouée dynamiquement ?",
        userAnswer: "free()",
        correctAnswer: "free()",
        isCorrect: true,
        explanation: "La fonction free() libère la mémoire précédemment allouée avec malloc(), calloc() ou realloc()."
      },
      {
        id: 4,
        question: "Comment déclarer une fonction qui ne retourne rien ?",
        userAnswer: "null fonction()",
        correctAnswer: "void fonction()",
        isCorrect: false,
        explanation: "Le mot-clé void indique qu'une fonction ne retourne aucune valeur."
      },
      {
        id: 5,
        question: "Quelle est la taille en octets d'un int sur la plupart des systèmes modernes ?",
        userAnswer: "4 octets",
        correctAnswer: "4 octets",
        isCorrect: true,
        explanation: "Sur la plupart des systèmes 32 et 64 bits modernes, un int fait 4 octets (32 bits)."
      }
    ]
  };

  const correctCount = correction.questions.filter(q => q.isCorrect).length;
  const incorrectCount = correction.questions.length - correctCount;

  return (
    <div className="CorrectionModal-overlay" onClick={onClose}>
      <div 
        className={`CorrectionModal-container ${isFullscreen ? 'CorrectionModal-container-fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="CorrectionModal-header">
          <div className="CorrectionModal-header-content">
            <div className="CorrectionModal-header-icon">
              <CheckCircle size={28} />
            </div>
            <div className="CorrectionModal-header-text">
              <h2 className="CorrectionModal-title">Correction du Quiz</h2>
              <p className="CorrectionModal-subtitle">
                {correction.date} • {correction.time}
              </p>
            </div>
          </div>
          <div className="CorrectionModal-header-actions">
            <button 
              className="CorrectionModal-fullscreen-btn" 
              onClick={toggleFullscreen}
              title={isFullscreen ? "Mode fenêtre" : "Plein écran"}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button className="CorrectionModal-close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Score Summary */}
        <div className="CorrectionModal-summary">
          <div className="CorrectionModal-score">
            <div className="CorrectionModal-score-value">{correction.score}</div>
            <div className="CorrectionModal-score-label">Score final</div>
          </div>
          
          <div className="CorrectionModal-stats">
            <div className="CorrectionModal-stat CorrectionModal-stat-correct">
              <CheckCircle size={20} />
              <span>{correctCount} Correctes</span>
            </div>
            <div className="CorrectionModal-stat CorrectionModal-stat-incorrect">
              <XCircle size={20} />
              <span>{incorrectCount} Incorrectes</span>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="CorrectionModal-content">
          <h3 className="CorrectionModal-section-title">Détail des réponses</h3>
          
          <div className="CorrectionModal-questions">
            {correction.questions.map((q) => (
              <div 
                key={q.id} 
                className={`CorrectionModal-question ${q.isCorrect ? 'CorrectionModal-question-correct' : 'CorrectionModal-question-incorrect'}`}
              >
                <div className="CorrectionModal-question-header">
                  <div className="CorrectionModal-question-number">
                    {q.isCorrect ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                    <span>Question {q.id}</span>
                  </div>
                </div>

                <div className="CorrectionModal-question-text">
                  {q.question}
                </div>

                <div className="CorrectionModal-answers">
                  <div className={`CorrectionModal-answer ${q.isCorrect ? 'CorrectionModal-answer-correct' : 'CorrectionModal-answer-user'}`}>
                    <div className="CorrectionModal-answer-label">
                      {q.isCorrect ? 'Votre réponse (correcte)' : 'Votre réponse'}
                    </div>
                    <div className="CorrectionModal-answer-text">{q.userAnswer}</div>
                  </div>

                  {!q.isCorrect && (
                    <div className="CorrectionModal-answer CorrectionModal-answer-correct">
                      <div className="CorrectionModal-answer-label">Bonne réponse</div>
                      <div className="CorrectionModal-answer-text">{q.correctAnswer}</div>
                    </div>
                  )}
                </div>

                <div className="CorrectionModal-explanation">
                  <div className="CorrectionModal-explanation-icon">💡</div>
                  <div className="CorrectionModal-explanation-text">{q.explanation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="CorrectionModal-footer">
          <button className="CorrectionModal-btn CorrectionModal-btn-secondary">
            <Download size={20} />
            Télécharger
          </button>
          <button className="CorrectionModal-btn CorrectionModal-btn-primary">
            <RotateCcw size={20} />
            Refaire le quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorrectionModal;
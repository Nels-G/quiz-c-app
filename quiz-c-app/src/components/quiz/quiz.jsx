import React, { useState } from 'react';
import './quiz.css';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(19);
  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const totalQuestions = 20;

  const question = {
    id: 19,
    text: "Comment déclarer une fonction qui ne retourne rien ?",
    options: [
      "null fonction()",
      "void fonction()",
      "empty fonction()",
      "none fonction()"
    ],
    correctAnswer: 1
  };

  const progress = (currentQuestion / totalQuestions) * 100;

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <main className="quiz-main">
      <div className="quiz-status-badges">
        <span className="quiz-badge">OK</span>
        <span className="quiz-badge">OK</span>
        <span className="quiz-badge">OK</span>
      </div>

      <div className="quiz-card">
        <div className="quiz-progress-section">
          <div className="quiz-progress-info">
            <span className="quiz-question-number">
              Question {currentQuestion} / <span>{totalQuestions}</span>
            </span>
            <span className="quiz-percentage">{Math.round(progress)}%</span>
          </div>
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="quiz-question-text">{question.text}</h2>

        <div className="quiz-options">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`quiz-option ${selectedAnswer === index ? 'quiz-option--selected' : ''}`}
              onClick={() => setSelectedAnswer(index)}
            >
              <div className="quiz-option-radio">
                {selectedAnswer === index && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="quiz-option-text">{option}</span>
            </div>
          ))}
        </div>

        <div className="quiz-navigation">
          <button 
            className="quiz-btn quiz-btn--outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
          >
            Précédent
          </button>
          <button 
            className="quiz-btn quiz-btn--primary" 
            onClick={handleNext}
          >
            Suivant
          </button>
        </div>
      </div>
    </main>
  );
};

export default Quiz;
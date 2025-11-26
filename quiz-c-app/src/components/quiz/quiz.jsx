import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './quiz.css';
import apiService from '../../services/api';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0); // ← Commence à 0
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeStarted, setTimeStarted] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = () => {
    if (location.state?.quiz) {
      setQuizData(location.state.quiz);
      setTimeStarted(Date.now());
      setLoading(false);
    } else {
      // Si pas de quiz passé en props, rediriger vers l'accueil
      navigate('/accueil');
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null && quizData) {
      const currentQ = quizData.questions[currentQuestion];
      const newAnswer = {
        question_id: currentQ.id,
        answer_id: currentQ.answers[selectedAnswer].id
      };
      
      setUserAnswers([...userAnswers, newAnswer]);
      
      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        submitQuiz();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const submitQuiz = async () => {
    if (!quizData) return;

    const timeTaken = Math.floor((Date.now() - timeStarted) / 1000);
    
    try {
      const result = await apiService.submitQuiz(quizData.id, userAnswers, timeTaken);
      
      navigate('/result', { 
        state: { 
          score: result.score,
          correctAnswers: result.correct_answers,
          totalQuestions: result.total_questions,
          timeTaken: timeTaken
        }
      });
    } catch (error) {
      console.error('Erreur soumission quiz:', error);
      alert('Erreur lors de la soumission du quiz');
    }
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="quiz-loading-spinner"></div>
        <p>Chargement du quiz...</p>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="quiz-error">
        <p>Erreur lors du chargement du quiz</p>
        <button onClick={() => navigate('/accueil')}>Retour à l'accueil</button>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <main className="quiz-main">
      <div className="quiz-card">
        <div className="quiz-progress-section">
          <div className="quiz-progress-info">
            <span className="quiz-question-number">
              Question {currentQuestion + 1} / <span>{quizData.questions.length}</span>
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

        <h2 className="quiz-question-text">{question.question_text}</h2>

        <div className="quiz-options">
          {question.answers.map((answer, index) => (
            <div
              key={answer.id}
              className={`quiz-option ${selectedAnswer === index ? 'quiz-option--selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="quiz-option-radio">
                {selectedAnswer === index && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="quiz-option-text">{answer.answer_text}</span>
            </div>
          ))}
        </div>

        <div className="quiz-navigation">
          <button 
            className="quiz-btn quiz-btn--outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Précédent
          </button>
          <button 
            className="quiz-btn quiz-btn--primary" 
            onClick={handleNext}
            disabled={selectedAnswer === null}
          >
            {currentQuestion === quizData.questions.length - 1 ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Quiz;
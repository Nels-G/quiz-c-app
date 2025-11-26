const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
    constructor() {
        this.sessionId = localStorage.getItem('quiz_session_id') || this.generateSessionId();
        localStorage.setItem('quiz_session_id', this.sessionId);
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Sessions utilisateur
    async createUserSession(userData) {
        return this.request('/sessions/', {
            method: 'POST',
            body: {
                session_id: this.sessionId,
                ...userData
            }
        });
    }

    async getUserStats() {
        return this.request(`/sessions/stats/?session_id=${this.sessionId}`);
    }

    // Génération de quiz
    async generateQuiz(level) {
        return this.request('/quizzes/generate_quiz/', {
            method: 'POST',
            body: {
                session_id: this.sessionId,
                level: level
            }
        });
    }

    // Soumission des réponses
    async submitQuiz(quizId, answers, timeTaken) {
        return this.request(`/quizzes/${quizId}/submit_answers/`, {
            method: 'POST',
            body: {
                session_id: this.sessionId,
                answers: answers,
                time_taken: timeTaken
            }
        });
    }

    // Historique des quiz
    async getQuizHistory() {
        return this.request(`/quizzes/history/?session_id=${this.sessionId}`);
    }

    // Classement
    async getLeaderboard() {
        return this.request('/leaderboard/');
    }

    // Récupérer la correction d'un quiz
    async getQuizCorrection(attemptId) {
        return this.request(`/quizzes/correction/${attemptId}/`);
    }

    // Méthode utilitaire pour récupérer la session actuelle
    getCurrentSession() {
        return {
            sessionId: this.sessionId,
            isAuthenticated: !!localStorage.getItem('quiz_session_id')
        };
    }

    // Méthode pour effacer la session (déconnexion)
    clearSession() {
        localStorage.removeItem('quiz_session_id');
        this.sessionId = this.generateSessionId();
        localStorage.setItem('quiz_session_id', this.sessionId);
    }
}

export default new ApiService();
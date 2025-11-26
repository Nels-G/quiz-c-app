import json

class AIService:
    def generate_quiz_questions(self, level, num_questions=5):
        return self._get_fallback_questions(level, num_questions)
    
    def _get_fallback_questions(self, level, num_questions):
        questions = {
            'debutant': [
                {
                    "question_text": "Comment déclarer une fonction qui ne retourne rien en C?",
                    "explanation": "Le mot-clé 'void' indique que la fonction ne retourne aucune valeur.",
                    "answers": [
                        {"text": "null fonction()", "correct": False},
                        {"text": "void fonction()", "correct": True},
                        {"text": "empty fonction()", "correct": False},
                        {"text": "none fonction()", "correct": False}
                    ]
                },
                {
                    "question_text": "Quel est le bon format pour afficher un entier avec printf?",
                    "explanation": "%d est le format spécifique pour les entiers en C.",
                    "answers": [
                        {"text": "%s", "correct": False},
                        {"text": "%d", "correct": True},
                        {"text": "%c", "correct": False},
                        {"text": "%f", "correct": False}
                    ]
                }
            ],
            'intermediaire': [
                {
                    "question_text": "Comment alloue-t-on dynamiquement de la mémoire pour un entier?",
                    "explanation": "La fonction malloc(sizeof(int)) alloue la mémoire nécessaire pour un entier.",
                    "answers": [
                        {"text": "malloc(sizeof(int))", "correct": True},
                        {"text": "alloc(int)", "correct": False},
                        {"text": "new int", "correct": False},
                        {"text": "int.malloc()", "correct": False}
                    ]
                }
            ],
            'avance': [
                {
                    "question_text": "Qu'est-ce qu'un double pointeur (int**)?",
                    "explanation": "Un double pointeur est un pointeur qui pointe vers un autre pointeur.",
                    "answers": [
                        {"text": "Un pointeur vers un pointeur", "correct": True},
                        {"text": "Un pointeur de taille double", "correct": False},
                        {"text": "Un tableau à deux dimensions", "correct": False},
                        {"text": "Une structure complexe", "correct": False}
                    ]
                }
            ]
        }
        
        level_questions = questions.get(level, questions['debutant'])
        return {
            "quiz_title": f"Quiz C - Niveau {level}",
            "questions": level_questions
        }
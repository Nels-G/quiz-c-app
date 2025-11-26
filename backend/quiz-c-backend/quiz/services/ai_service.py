import os
import groq
import json
import re
import random
from django.conf import settings

class AIService:
    def __init__(self):
        self.client = groq.Groq(api_key=settings.GROQ_API_KEY)
    
    def generate_quiz_questions(self, level, num_questions=15):
        """
        Génère des questions de quiz variées avec l'IA Groq
        """
        try:
            print(f"🔮 Génération de {num_questions} questions pour le niveau {level} avec Groq AI...")
            
            prompt = self._build_prompt(level, num_questions)
            
            response = self.client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {
                        "role": "system",
                        "content": self._get_system_prompt()
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.9,  # Haute variabilité pour des questions différentes
                max_tokens=4000,
                top_p=0.9
            )
            
            quiz_data = self._parse_response(response.choices[0].message.content)
            print(f"✅ {len(quiz_data['questions'])} questions générées avec succès")
            return quiz_data
            
        except Exception as e:
            print(f"❌ Erreur IA: {e}, utilisation du fallback")
            return self._get_extended_fallback_questions(level, num_questions)
    
    def _get_system_prompt(self):
        return """Tu es un expert en programmation C avec 20 ans d'expérience en enseignement.
        Tu génères des questions de quiz éducatives, variées et techniquement précises.
        IMPORTANT: Ne répète jamais les mêmes questions. Chaque question doit être unique.
        Format de réponse STRICT JSON uniquement."""

    def _build_prompt(self, level, num_questions):
        level_contexts = {
            'debutant': {
                'topics': [
                    'variables et types de données (int, float, char, double)',
                    'opérateurs (arithmétiques, relationnels, logiques)',
                    'structures de contrôle (if, else, switch, for, while, do-while)',
                    'fonctions (déclaration, définition, paramètres, valeur de retour)',
                    'entrées/sorties basiques (printf, scanf)',
                    'tableaux à une dimension',
                    'portée des variables',
                    'constantes et #define',
                    'opérateurs d\'incrémentation/décrémentation',
                    'conversion de types'
                ],
                'examples': 'déclaration de variables, boucles simples, fonctions basiques'
            },
            'intermediaire': {
                'topics': [
                    'pointeurs et arithmétique des pointeurs',
                    'allocation mémoire dynamique (malloc, calloc, free)',
                    'structures et unions',
                    'manipulation de fichiers (fopen, fclose, fread, fwrite)',
                    'fonctions récursives',
                    'tableaux multidimensionnels',
                    'chaînes de caractères et fonctions string.h',
                    'passage de paramètres par valeur et par référence',
                    'pointeurs de fonctions',
                    'directives du préprocesseur'
                ],
                'examples': 'manipulation de pointeurs, structures de données, gestion de fichiers'
            },
            'avance': {
                'topics': [
                    'gestion mémoire avancée (realloc, memory leaks)',
                    'structures complexes (listes chaînées, arbres)',
                    'optimisation de code',
                    'manipulation bas niveau (bits, opérateurs bit à bit)',
                    'fonctions variadiques',
                    'pointeurs multiples (int**, char***)',
                    'gestion d\'erreurs et assertions',
                    'programmation modulaire',
                    'compilation conditionnelle',
                    'structures de données avancées'
                ],
                'examples': 'allocation dynamique complexe, structures de données custom, optimisation'
            }
        }
        
        context = level_contexts.get(level, level_contexts['debutant'])
        
        return f"""
        GÉNÈRE UN QUIZ COMPLET ET UNIQUE de programmation C.
        
        NIVEAU: {level}
        NOMBRE DE QUESTIONS: {num_questions}
        THÈMES: {', '.join(context['topics'])}
        EXEMPLES: {context['examples']}
        
        EXIGENCES CRITIQUES:
        - {num_questions} questions ABSOLUMENT UNIQUES et NON RÉPÉTITIVES
        - Chaque question doit aborder un concept DIFFÉRENT
        - 4 réponses par question, une seule correcte
        - Difficulté progressive
        - Questions pratiques et réalistes
        - Explications détaillées et éducatives
        
        FORMAT JSON STRICT:
        {{
            "quiz_title": "Quiz Programmation C - Niveau {level}",
            "questions": [
                {{
                    "question_text": "Question claire, unique et précise",
                    "explanation": "Explication détaillée avec exemples de code si nécessaire",
                    "answers": [
                        {{"text": "Réponse plausible mais incorrecte", "correct": false}},
                        {{"text": "Réponse correcte et précise", "correct": true}},
                        {{"text": "Réponse plausible mais incorrecte", "correct": false}},
                        {{"text": "Réponse plausible mais incorrecte", "correct": false}}
                    ]
                }}
            ]
        }}
        
        GARANTIS l'unicité et la variété des questions. Pas de répétitions!
        """

    def _parse_response(self, content):
        try:
            # Nettoyer et extraire le JSON
            content = content.strip()
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            
            if json_match:
                json_str = json_match.group()
                quiz_data = json.loads(json_str)
                
                # Validation basique
                if 'questions' in quiz_data and isinstance(quiz_data['questions'], list):
                    print(f"✅ Quiz parsé: {len(quiz_data['questions'])} questions")
                    return quiz_data
                else:
                    raise ValueError("Structure invalide")
            else:
                raise ValueError("Aucun JSON trouvé")
                
        except (json.JSONDecodeError, ValueError) as e:
            print(f"❌ Erreur parsing JSON: {e}")
            return self._get_extended_fallback_questions('debutant', 10)

    def _get_extended_fallback_questions(self, level, num_questions):
        """Questions de secours étendues avec grande variété"""
        print(f"🔄 Utilisation du fallback avec {num_questions} questions")
        
        all_questions = {
            'debutant': [
                {
                    "question_text": "Comment déclarer une fonction qui ne retourne rien en C?",
                    "explanation": "Le mot-clé 'void' indique que la fonction ne retourne aucune valeur. Exemple: void ma_fonction() { }",
                    "answers": [
                        {"text": "null fonction()", "correct": False},
                        {"text": "void fonction()", "correct": True},
                        {"text": "empty fonction()", "correct": False},
                        {"text": "none fonction()", "correct": False}
                    ]
                },
                {
                    "question_text": "Quel est le bon format pour afficher un entier avec printf?",
                    "explanation": "%d est le format spécifique pour les entiers signés en C. Exemple: printf(\"%d\", nombre);",
                    "answers": [
                        {"text": "%s", "correct": False},
                        {"text": "%d", "correct": True},
                        {"text": "%c", "correct": False},
                        {"text": "%f", "correct": False}
                    ]
                },
                {
                    "question_text": "Quel opérateur utilise-t-on pour l'affectation en C?",
                    "explanation": "L'opérateur '=' est utilisé pour l'affectation. Exemple: int x = 10;",
                    "answers": [
                        {"text": ":=", "correct": False},
                        {"text": "=", "correct": True},
                        {"text": "==", "correct": False},
                        {"text": "=>", "correct": False}
                    ]
                },
                {
                    "question_text": "Comment déclare-t-on un tableau de 10 entiers?",
                    "explanation": "La syntaxe correcte est: int tableau[10]; Cela déclare un tableau de 10 entiers indexés de 0 à 9.",
                    "answers": [
                        {"text": "array int[10]", "correct": False},
                        {"text": "int tableau[10]", "correct": True},
                        {"text": "tableau int(10)", "correct": False},
                        {"text": "int[] tableau = new int[10]", "correct": False}
                    ]
                },
                {
                    "question_text": "Quelle boucle est utilisée quand on connaît le nombre d'itérations?",
                    "explanation": "La boucle 'for' est idéale quand on connaît le nombre d'itérations à l'avance.",
                    "answers": [
                        {"text": "while", "correct": False},
                        {"text": "for", "correct": True},
                        {"text": "do-while", "correct": False},
                        {"text": "repeat", "correct": False}
                    ]
                },
                {
                    "question_text": "Comment lire un entier depuis l'entrée standard?",
                    "explanation": "La fonction scanf avec le format %d est utilisée: scanf(\"%d\", &variable);",
                    "answers": [
                        {"text": "read_int()", "correct": False},
                        {"text": "scanf(\"%d\", &variable)", "correct": True},
                        {"text": "get_integer()", "correct": False},
                        {"text": "input_int()", "correct": False}
                    ]
                },
                {
                    "question_text": "Quel est le type de retour de la fonction main()?",
                    "explanation": "La fonction main() retourne généralement un int (0 pour succès, autre pour erreur).",
                    "answers": [
                        {"text": "void", "correct": False},
                        {"text": "int", "correct": True},
                        {"text": "char", "correct": False},
                        {"text": "float", "correct": False}
                    ]
                },
                {
                    "question_text": "Comment comparer deux chaînes de caractères?",
                    "explanation": "La fonction strcmp() de string.h compare deux chaînes et retourne 0 si égales.",
                    "answers": [
                        {"text": "string1 == string2", "correct": False},
                        {"text": "strcmp(string1, string2) == 0", "correct": True},
                        {"text": "string1.equals(string2)", "correct": False},
                        {"text": "compare(string1, string2)", "correct": False}
                    ]
                },
                {
                    "question_text": "Quelle directive inclut la bibliothèque standard d'entrée/sortie?",
                    "explanation": "#include <stdio.h> inclut les fonctions d'entrée/sortie comme printf et scanf.",
                    "answers": [
                        {"text": "#include <stdlib.h>", "correct": False},
                        {"text": "#include <stdio.h>", "correct": True},
                        {"text": "#include <io.h>", "correct": False},
                        {"text": "#import <stdio.h>", "correct": False}
                    ]
                },
                {
                    "question_text": "Comment initialiser toutes les cases d'un tableau à zéro?",
                    "explanation": "int tableau[5] = {0}; initialise toutes les cases à zéro.",
                    "answers": [
                        {"text": "int tableau[5] = {0};", "correct": True},
                        {"text": "int tableau[5] = zero;", "correct": False},
                        {"text": "int tableau[5] = { };", "correct": False},
                        {"text": "int tableau[5] = null;", "correct": False}
                    ]
                }
            ],
            'intermediaire': [
                {
                    "question_text": "Comment alloue-t-on dynamiquement de la mémoire pour un entier?",
                    "explanation": "malloc(sizeof(int)) alloue la mémoire, mais il faut vérifier le retour et libérer avec free().",
                    "answers": [
                        {"text": "malloc(sizeof(int))", "correct": True},
                        {"text": "alloc(int)", "correct": False},
                        {"text": "new int", "correct": False},
                        {"text": "int.malloc()", "correct": False}
                    ]
                },
                {
                    "question_text": "Qu'est-ce qu'un pointeur NULL?",
                    "explanation": "NULL est un pointeur qui ne pointe vers aucune adresse mémoire valide, souvent utilisé pour l'initialisation.",
                    "answers": [
                        {"text": "Un pointeur non initialisé", "correct": False},
                        {"text": "Un pointeur qui pointe vers l'adresse 0", "correct": True},
                        {"text": "Un pointeur vers une chaîne vide", "correct": False},
                        {"text": "Un pointeur supprimé", "correct": False}
                    ]
                }
            ],
            'avance': [
                {
                    "question_text": "Qu'est-ce qu'un double pointeur (int**)?",
                    "explanation": "Un double pointeur stocke l'adresse d'un autre pointeur. Utile pour les tableaux 2D ou modifier des pointeurs dans des fonctions.",
                    "answers": [
                        {"text": "Un pointeur vers un pointeur", "correct": True},
                        {"text": "Un pointeur de taille double", "correct": False},
                        {"text": "Un tableau à deux dimensions", "correct": False},
                        {"text": "Une structure complexe", "correct": False}
                    ]
                }
            ]
        }
        
        # Mélanger les questions pour plus de variété
        level_questions = all_questions.get(level, all_questions['debutant'])
        random.shuffle(level_questions)
        
        # Étendre si nécessaire
        extended_questions = []
        while len(extended_questions) < num_questions:
            extended_questions.extend(level_questions)
        
        return {
            "quiz_title": f"Quiz C - Niveau {level} (Fallback)",
            "questions": extended_questions[:num_questions]
        }
from django.db import transaction
from django.shortcuts import get_object_or_404
from ..models import Quiz, Question, Answer, UserQuizAttempt, UserAnswer

class QuizService:
    
    @staticmethod
    @transaction.atomic
    def create_quiz_from_ai_data(quiz_data, level):
        quiz = Quiz.objects.create(
            title=quiz_data['quiz_title'],
            description=f"Quiz généré automatiquement pour le niveau {level}",
            level=level,
            total_questions=len(quiz_data['questions'])
        )
        
        for question_data in quiz_data['questions']:
            question = Question.objects.create(
                quiz=quiz,
                question_text=question_data['question_text'],
                explanation=question_data.get('explanation', '')
            )
            
            for answer_data in question_data['answers']:
                Answer.objects.create(
                    question=question,
                    answer_text=answer_data['text'],
                    is_correct=answer_data['correct']
                )
        
        return quiz
    
    @staticmethod
    @transaction.atomic
    def submit_quiz_answers(quiz_id, session_id, user_answers, time_taken):
        from .user_service import UserService
        
        quiz = get_object_or_404(Quiz, id=quiz_id)
        user_session = UserService.get_user_by_session(session_id)
        
        if not user_session:
            raise ValueError("Session utilisateur non trouvée")
        
        correct_answers_count = 0
        total_questions = quiz.questions.count()
        
        attempt = UserQuizAttempt.objects.create(
            user_session=user_session,
            quiz=quiz,
            total_questions=total_questions,
            time_taken=time_taken
        )
        
        user_answers_details = []
        for answer_data in user_answers:
            question = get_object_or_404(Question, id=answer_data['question_id'])
            selected_answer = get_object_or_404(Answer, id=answer_data['answer_id'])
            
            is_correct = selected_answer.is_correct
            if is_correct:
                correct_answers_count += 1
            
            user_answer = UserAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_answer=selected_answer,
                is_correct=is_correct
            )
            
            user_answers_details.append({
                'question_id': question.id,
                'selected_answer_id': selected_answer.id,
                'is_correct': is_correct,
                'explanation': question.explanation
            })
        
        score = (correct_answers_count / total_questions) * 100 if total_questions > 0 else 0
        
        attempt.score = score
        attempt.correct_answers = correct_answers_count
        attempt.save()
        
        UserService.update_user_score(session_id, int(score))
        
        return {
            'attempt': attempt,
            'score': score,
            'correct_answers': correct_answers_count,
            'total_questions': total_questions,
            'user_answers_details': user_answers_details
        }
    
    @staticmethod
    def get_user_quiz_history(session_id, limit=10):
        from .user_service import UserService
        
        user = UserService.get_user_by_session(session_id)
        if not user:
            return []
        
        return UserQuizAttempt.objects.filter(
            user_session=user
        ).select_related('quiz').order_by('-completed_at')[:limit]
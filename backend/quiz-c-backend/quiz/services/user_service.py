import uuid
from django.db import models
from ..models import UserSession

class UserService:
    
    @staticmethod
    def get_or_create_user_session(session_id, user_data):
        first_name = user_data.get('first_name', '').strip()
        last_name = user_data.get('last_name', '').strip()
        level = user_data.get('level', 'debutant')
        
        if not session_id:
            session_id = str(uuid.uuid4())
        
        user_session, created = UserSession.objects.get_or_create(
            session_id=session_id,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'level': level
            }
        )
        
        if not created:
            user_session.first_name = first_name
            user_session.last_name = last_name
            user_session.level = level
            user_session.save()
        
        return user_session, created, session_id
    
    @staticmethod
    def get_user_by_session(session_id):
        try:
            return UserSession.objects.get(session_id=session_id)
        except UserSession.DoesNotExist:
            return None
    
    @staticmethod
    def update_user_score(session_id, additional_score):
        user = UserService.get_user_by_session(session_id)
        if user:
            user.total_score += additional_score
            user.save()
            return user
        return None
    
    @staticmethod
    def get_leaderboard(limit=10):
        return UserSession.objects.all().order_by('-total_score')[:limit]
    
    @staticmethod
    def get_user_stats(session_id):
        user = UserService.get_user_by_session(session_id)
        if not user:
            return None
        
        attempts = user.userquizattempt_set.all()
        total_quizzes = attempts.count()
        average_score = attempts.aggregate(avg_score=models.Avg('score'))['avg_score'] or 0
        total_time = attempts.aggregate(total_time=models.Sum('time_taken'))['total_time'] or 0
        
        return {
            'user': user,
            'total_quizzes': total_quizzes,
            'average_score': round(average_score, 2),
            'total_time_seconds': total_time,
            'total_score': user.total_score
        }
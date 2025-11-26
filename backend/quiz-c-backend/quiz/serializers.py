from rest_framework import serializers
from .models import UserSession, Quiz, Question, Answer, UserQuizAttempt

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'explanation', 'answers']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'level', 'duration_minutes', 'questions']

class UserSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = ['session_id', 'first_name', 'last_name', 'level', 'total_score']

class UserQuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    
    class Meta:
        model = UserQuizAttempt
        fields = ['id', 'quiz_title', 'score', 'correct_answers', 'total_questions', 'time_taken', 'completed_at']

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = ['first_name', 'last_name', 'level', 'total_score']
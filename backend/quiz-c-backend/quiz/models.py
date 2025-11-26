from django.db import models
import uuid

class UserSession(models.Model):
    session_id = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=[
        ('debutant', 'Débutant'),
        ('intermediaire', 'Intermédiaire'),
        ('avance', 'Avancé')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    total_score = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.level}"

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    level = models.CharField(max_length=20)
    duration_minutes = models.IntegerField(default=20)
    total_questions = models.IntegerField(default=15)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, default='multiple_choice')
    explanation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.question_text[:50]

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.answer_text[:50]} - {'Correct' if self.is_correct else 'Incorrect'}"

class UserQuizAttempt(models.Model):
    user_session = models.ForeignKey(UserSession, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField()
    correct_answers = models.IntegerField()
    total_questions = models.IntegerField()
    time_taken = models.IntegerField()  # en secondes
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-completed_at']

class UserAnswer(models.Model):
    attempt = models.ForeignKey(UserQuizAttempt, on_delete=models.CASCADE, related_name='user_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    is_correct = models.BooleanField()
    
    def __str__(self):
        return f"Question {self.question.id} - {'Correct' if self.is_correct else 'Incorrect'}"
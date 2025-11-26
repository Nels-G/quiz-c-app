from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import UserSession, Quiz, Question, Answer, UserQuizAttempt, UserAnswer
from .serializers import UserSessionSerializer, QuizSerializer, LeaderboardSerializer, UserQuizAttemptSerializer
from quiz.services.user_service import UserService
from quiz.services.quiz_service import QuizService
from quiz.services.ai_service import AIService

class UserSessionViewSet(viewsets.ModelViewSet):
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer
    
    def create(self, request):
        print(f"📥 Création session - Données: {request.data}")
        
        session_id = request.data.get('session_id')
        user_data = {
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'level': request.data.get('level')
        }
        
        user_session, created, session_id = UserService.get_or_create_user_session(
            session_id, user_data
        )
        
        serializer = self.get_serializer(user_session)
        response_data = serializer.data
        response_data['session_id'] = session_id
        
        print(f"✅ Session {'créée' if created else 'mise à jour'} - ID: {session_id}")
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        session_id = request.query_params.get('session_id')
        print(f"📊 Stats demandées - Session: {session_id}")
        
        if not session_id:
            return Response(
                {'error': 'Session ID requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        stats = UserService.get_user_stats(session_id)
        if not stats:
            return Response(
                {'error': 'Utilisateur non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            'total_quizzes': stats['total_quizzes'],
            'average_score': stats['average_score'],
            'total_time_seconds': stats['total_time_seconds'],
            'total_score': stats['total_score']
        })

class QuizViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'])
    def generate_quiz(self, request):
        print(f"🎯 Génération quiz demandée - Données: {request.data}")
        
        level = request.data.get('level', 'debutant')
        session_id = request.data.get('session_id')
        
        if not session_id:
            return Response(
                {'error': 'Session ID requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier que l'utilisateur existe
        user = UserService.get_user_by_session(session_id)
        if not user:
            return Response(
                {'error': 'Session utilisateur invalide'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Générer le quiz avec l'IA
            ai_service = AIService()
            quiz_data = ai_service.generate_quiz_questions(level)
            
            # Créer le quiz en base de données
            quiz_service = QuizService()
            quiz = quiz_service.create_quiz_from_ai_data(quiz_data, level)
            
            serializer = QuizSerializer(quiz)
            print(f"✅ Quiz généré - ID: {quiz.id}, Questions: {len(quiz_data['questions'])}")
            return Response(serializer.data)
            
        except Exception as e:
            print(f"❌ Erreur génération quiz: {e}")
            return Response(
                {'error': f'Erreur lors de la génération du quiz: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def submit_answers(self, request, pk=None):
        print(f"📥 Soumission quiz - ID: {pk}")
        print(f"📥 Session ID: {request.data.get('session_id')}")
        print(f"📥 Nombre de réponses: {len(request.data.get('answers', []))}")
        print(f"📥 Temps: {request.data.get('time_taken')}")
        
        session_id = request.data.get('session_id')
        answers = request.data.get('answers', [])
        time_taken = request.data.get('time_taken', 0)
        
        if not session_id:
            print("❌ Session ID manquant")
            return Response(
                {'error': 'Session ID requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not answers:
            print("❌ Aucune réponse fournie")
            return Response(
                {'error': 'Aucune réponse fournie'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            quiz_service = QuizService()
            result = quiz_service.submit_quiz_answers(pk, session_id, answers, time_taken)
            
            print(f"✅ Quiz soumis - Score: {result['score']}%, Correctes: {result['correct_answers']}/{result['total_questions']}")
            return Response({
                'score': result['score'],
                'correct_answers': result['correct_answers'],
                'total_questions': result['total_questions'],
                'attempt_id': result['attempt'].id
            })
            
        except Exception as e:
            print(f"❌ Erreur soumission: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        session_id = request.query_params.get('session_id')
        print(f"📚 Historique demandé - Session: {session_id}")
        
        if not session_id:
            return Response(
                {'error': 'Session ID requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        history = QuizService.get_user_quiz_history(session_id)
        serializer = UserQuizAttemptSerializer(history, many=True)
        
        print(f"✅ Historique récupéré - {len(history)} tentatives")
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def correction(self, request, attempt_id=None):
        print(f"📝 Correction demandée - Tentative: {attempt_id}")
        
        if not attempt_id:
            return Response(
                {'error': 'ID de tentative requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Cette méthode devrait être implémentée dans QuizService
            correction_data = QuizService.get_quiz_correction(attempt_id)
            if not correction_data:
                return Response(
                    {'error': 'Correction non trouvée'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            return Response(correction_data)
            
        except Exception as e:
            print(f"❌ Erreur correction: {e}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class LeaderboardViewSet(viewsets.ViewSet):
    
    def list(self, request):
        print("🏆 Classement demandé")
        
        leaderboard = UserService.get_leaderboard()
        serializer = LeaderboardSerializer(leaderboard, many=True)
        
        print(f"✅ Classement récupéré - {len(leaderboard)} utilisateurs")
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def top_10(self, request):
        print("🥇 Top 10 demandé")
        
        leaderboard = UserService.get_leaderboard(limit=10)
        serializer = LeaderboardSerializer(leaderboard, many=True)
        
        return Response({
            'top_10': serializer.data,
            'total_users': UserSession.objects.count()
        })
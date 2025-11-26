from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quiz.views import UserSessionViewSet, QuizViewSet, LeaderboardViewSet

router = DefaultRouter()
router.register(r'sessions', UserSessionViewSet)
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
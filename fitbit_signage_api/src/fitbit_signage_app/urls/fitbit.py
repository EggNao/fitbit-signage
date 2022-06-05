from django.urls import path
from fitbit_signage_app import views
from django.conf.urls import url

urlpatterns = [
    path('', views.DailyAPIView.as_view()),
    path('<str:user_id>', views.FitbitAPIView.as_view()),
    path('goals/<str:user_id>', views.GoalsAPIView.as_view()),
    path('steps/<str:user_id>', views.StepPerHourAPIView.as_view()),
    path('exercise/<str:user_id>', views.RecommendExerciseAPIView.as_view()),
    path('wear/<str:user_id>', views.FitbitWearCheckAPIView.as_view()),
]
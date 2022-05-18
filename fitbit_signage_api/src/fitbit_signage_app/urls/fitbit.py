from django.urls import path
from fitbit_signage_app import views
from django.conf.urls import url

urlpatterns = [
    path('<str:user_id>', views.FitbitAPIView.as_view()),
    path('goals/<str:user_id>', views.GoalsAPIView.as_view()),
]


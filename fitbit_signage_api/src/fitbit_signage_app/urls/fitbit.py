from django.urls import path
from fitbit_signage_app import views
from django.conf.urls import url

urlpatterns = [
    path('', views.FitbitAPIView.as_view()),
    path('goals/', views.GoalsAPIView.as_view()),
]


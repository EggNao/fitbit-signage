from django.urls import path
from fitbit_signage_app import views
from django.conf.urls import url

urlpatterns = [
    path('<str:user_id>', views.WeekDataAPIView.as_view()),
    path('rank/<str:user_id>', views.RankAPIView.as_view()),
    path('stamp/<str:user_id>', views.StampAPIView.as_view()),
]


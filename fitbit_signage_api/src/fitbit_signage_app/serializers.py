from asyncore import read
from django.db.models import fields
from rest_framework import serializers
from .models import User, DailyScore, UserGoal, UserRank


class UserSerializer(serializers.ModelSerializer):
    
    """User Class Serializer"""
    
    class Meta:
        model = User
        fields = ('user_id', 'client_id', 'client_secret', 'name', 'rank', 'access_token', 'refresh_token')
        read_only_fields = ('user_id', 'client_id', 'client_secret')
        
class UserRankSerializer(serializers.ModelSerializer):
    
    "UserRank Class Serializer"
    class Meta:
        model = UserRank
        fields = ('user', 'rank', 'rate', 'is_sleep', 'is_steps', 'is_calories')

        
class UserGoalSerializer(serializers.ModelSerializer):
    
    "UserGoal Class Serializer"
    class Meta:
        model = UserGoal
        fields = ('user', 'sleep_goal', 'steps_goal', 'calories_goal')
        
        
class DailyScoreSerializer(serializers.ModelSerializer):

    "DailyScore Class Serializer"
    
    class Meta:
        model = DailyScore
        fields = ('user', 'sleep_score', 'sleep_minutes', 'steps', 'calories', 'weight', 'is_wearing')


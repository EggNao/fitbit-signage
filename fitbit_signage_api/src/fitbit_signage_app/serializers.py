from pyexpat import model
from django.db.models import fields
from rest_framework import serializers
from .models import User, DailyScore


class UserSerializer(serializers.ModelSerializer):
    
    """User Class Serializer"""
    
    class Meta:
        model = User
        fields = ('user_id', 'client_id', 'client_secret', 'name', 'rank', 'access_token', 'refresh_token')
        read_only_fields = ('user_id', 'client_id', 'client_secret')
        
class DailyScoreSerializer(serializers.ModelSerializer):

    "DailyScore Class Serializer"
    
    class Meta:
        model = DailyScore
        field = ('user', 'sleep_score', 'steps', 'calories', 'achievement')
        read_only_fields = ('user')


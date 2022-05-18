from django.db import models

class User(models.Model):
    user_id = models.CharField(primary_key=True, unique=True, max_length=50)
    client_id = models.CharField(max_length=50)
    client_secret = models.CharField(max_length=255)
    name = models.CharField(max_length=50)
    rank = models.IntegerField(default=1)
    access_token = models.TextField()
    refresh_token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

class DailyScore(models.Model):
    user = models.ForeignKey(User, to_field='user_id', on_delete=models.CASCADE, related_name='user_score')
    sleep_score = models.IntegerField()
    steps = models.IntegerField(default=0)
    calories = models.IntegerField(default=0)
    achievement = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    
    
    
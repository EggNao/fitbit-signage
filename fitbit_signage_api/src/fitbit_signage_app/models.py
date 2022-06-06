from email.policy import default
from statistics import mode
from django.db import models

# user table
class User(models.Model):
    user_id = models.CharField(primary_key=True, unique=True, max_length=50)
    client_id = models.CharField(max_length=50)
    client_secret = models.CharField(max_length=255)
    name = models.CharField(max_length=50)
    access_token = models.TextField()
    refresh_token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# user rank table    
class UserRank(models.Model):
    user = models.ForeignKey(User, to_field='user_id', on_delete=models.CASCADE, related_name='user_rank', primary_key=True)
    rank = models.IntegerField(default=1)
    rate = models.FloatField(default=0)
    is_sleep = models.BooleanField(default=False)
    is_steps = models.BooleanField(default=False)
    is_calories = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
# goals table / day
# サイネージを見て目標値を変えようと思ったかを検証するためにuserを主キーにしない
class UserGoal(models.Model):
    user = models.ForeignKey(User, to_field='user_id', on_delete=models.CASCADE, related_name='user_goals')
    sleep_goal = models.IntegerField()
    steps_goal = models.IntegerField()
    calories_goal = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# scores table / day
class DailyScore(models.Model):
    user = models.ForeignKey(User, to_field='user_id', on_delete=models.CASCADE, related_name='user_score')
    sleep_score = models.IntegerField()
    sleep_minutes = models.IntegerField()
    steps = models.IntegerField()
    calories = models.IntegerField()
    achievement = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    
    
    
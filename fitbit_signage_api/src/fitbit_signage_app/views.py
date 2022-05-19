from http.client import OK
from tkinter.tix import Tree
from django.shortcuts import render, get_object_or_404, get_list_or_404, redirect
from django.http import Http404
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from django.views.decorators.clickjacking import xframe_options_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from rest_framework import status, views, exceptions
from rest_framework.request import Request
from rest_framework.response import Response

import datetime
import fitbit

from .models import User, DailyScore, UserGoal, UserRank
from .serializers import UserSerializer, DailyScoreSerializer, UserGoalSerializer, UserRankSerializer
from .update_token import updateToken


class GoalsAPIView(views.APIView):
    
    serializer_class = UserGoalSerializer
    
    # 今日の日付を取得
    TODAY = str(datetime.date.today())
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        '''
        user_idに紐ずくユーザの目標値を返す
        
        レスポンス形式
        {
            'steps': int,
            'calories': int
            'sleep': int
        }
        
        '''
        # 今日の目標値の取得
        datetime_today = datetime.date.today()
        user_goals = UserGoal.objects.filter(user=user_id, created_at__range=(datetime_today, datetime_today+datetime.timedelta(days=1))).order_by('-created_at').first()
        
        goals = dict()
        
        if user_goals:
            goals['steps'] = user_goals.steps_goal
            goals['caloriesOut'] = user_goals.calories_goal
            goals['sleep'] = user_goals.sleep_goal
        else:

            # ユーザ情報の取り出し
            client_obj = get_object_or_404(User, user_id=user_id)
            # FitbitでClient情報を取得
            client = fitbit.Fitbit(client_obj.client_id, client_obj.client_secret,
                        access_token = client_obj.access_token,
                        refresh_token = client_obj.refresh_token,
                        refresh_cb=updateToken)
            
            goals = client.make_request("https://api.fitbit.com//1/user/-/activities/goals/daily.json")['goals']
            goals['sleep'] = client.make_request("https://api.fitbit.com/1.2/user/-/sleep/goal.json")['goal']['minDuration']
            
            serializer = serializer = self.serializer_class(data={"user": user_id, "sleep_goal": goals['sleep'], "steps_goal": goals['steps'], "calories_goal": goals['caloriesOut']})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
        
        # response data
        return_data = {
            'steps': goals['steps'],
            'calorie': goals['caloriesOut'],
            'sleep' : goals['sleep']
        }
        
        return Response(data=return_data, status=status.HTTP_200_OK)
        
        

class FitbitAPIView(views.APIView):
    
    serializer_class = DailyScoreSerializer
    
    # 今日の日付を取得
    TODAY = str(datetime.date.today())
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        '''
        user_idに紐ずくユーザの今日のfitbitデータを返す
        
        レスポンス形式
        {
            'steps': [int],
	        'calories': [int],
	        'sleep_efficiency': [int]
        }
        
        '''
        
        # ユーザ情報の取り出し
        client_obj = get_object_or_404(User, user_id=user_id)
        # FitbitでClient情報を取得
        client = fitbit.Fitbit(client_obj.client_id, client_obj.client_secret,
                       access_token = client_obj.access_token,
                       refresh_token = client_obj.refresh_token,
                       refresh_cb=updateToken)
        

        datetime_today = datetime.date.today()
        today_data = DailyScore.objects.filter(user=user_id, created_at__range=(datetime_today, datetime_today+datetime.timedelta(days=1))).order_by('-created_at').first()
        
        # 歩数の取得
        steps_daily = client.make_request("https://api.fitbit.com/1/user/-/activities/steps/date/"+ self.TODAY +"/1d/15min.json")["activities-steps"][0]["value"]
        
        # カロリーの取得
        calories_daily = client.make_request("https://api.fitbit.com/1/user/-/activities/calories/date/"+ self.TODAY +"/1d/15min.json")["activities-calories"][0]["value"]
        
        #今日のデータの更新または作成
        if today_data:
            sleep_efficiency = today_data.sleep_score
            sleep_mitutes = today_data.sleep_minutes
            
            # 今日のデータの更新
            serializer = self.serializer_class(instance=today_data, data={"steps": steps_daily, "calories": calories_daily}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
        else: # 今日まだ取得していない場合
            # 睡眠データ取得
            sleep_data = client.make_request("https://api.fitbit.com/1.2/user/-/sleep/date/"+ self.TODAY +".json")['sleep'][0]
            # 睡眠効率を取得
            sleep_efficiency = sleep_data['efficiency']
            # 睡眠時間を取得
            sleep_mitutes = sleep_data['minutesAsleep']
            
            serializer = self.serializer_class(data={"user": user_id, "sleep_score": sleep_efficiency, 'sleep_minutes': sleep_mitutes, "steps": steps_daily, "calories": calories_daily})
            serializer.is_valid(raise_exception=True)
            serializer.save()

        
        # response data
        return_data = {
            'steps': [int(steps_daily)],
            'calorie': [int(calories_daily)],
            'sleep_efficiency': [sleep_efficiency],
            'sleep_time': [sleep_mitutes]
        }
        
        return Response(data=return_data, status=status.HTTP_200_OK)
    
    
class RankAPIView(views.APIView):
    
    serializers_class = UserRankSerializer
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        '''
        user_idに紐ずくユーザの目標の達成率に応じてランクを更新し，ランクを返す
        
        レスポンス形式
        {
            "rank": int
            "rate": float
        }
        '''
        
        # 今日の日付を取得
        datetime_today = datetime.date.today()
        
        # 現在のデータを取得
        today_data = DailyScore.objects.filter(user=user_id, created_at__range=(datetime_today, datetime_today+datetime.timedelta(days=1))).order_by('-created_at').first()
        
        # 目標値を取得
        user_goal = UserGoal.objects.filter(user=user_id, created_at__range=(datetime_today, datetime_today+datetime.timedelta(days=1))).order_by('-created_at').first()
        
        # ユーザのランクを取得
        user_rank = get_object_or_404(UserRank, user=user_id)
        
        # 達成率を計算
        # 睡眠
        rate_sleep = today_data.sleep_minutes / user_goal.sleep_goal
        # 歩数
        rate_steps = today_data.steps / user_goal.steps_goal
        # カロリー
        rate_calories = today_data.calories / user_goal.calories_goal
        
        # sum rate (max 3.0)
        rate = rate_sleep + rate_steps + rate_calories
        
        # update rank
        rank = user_rank.rank
        is_sleep = user_rank.is_sleep
        is_steps = user_rank.is_steps
        is_calories = user_rank.is_calories
        
        if rate_sleep >= 1 and not is_sleep:
            rank += 1
            is_sleep = True
            
        if rate_steps >= 1 and not is_steps:
            rank += 1
            is_steps = True
        
        if rate_calories >= 1 and not is_calories:
            rank += 1
            is_calories = True
        
        data = {
            'rank': rank,
            'is_sleep': is_sleep,
            'is_steps': is_steps,
            'is_calories': is_calories,
        }
        
        # update db
        serializer = self.serializers_class(instance=user_rank, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        
        # response data
        return_data = {
            'rank': rank,
            'rate': rate,
        }
      
        return Response(data=return_data, status=status.HTTP_200_OK)
    
class StampAPIView(views.APIView):
    
    serializer_class = DailyScoreSerializer
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        '''
        user_idに紐ずくユーザの1週間分のスタンプの有無を返す
        
        レスポンス形式
        {
            "stamp": [bool]
            "dateArray": [str]
        }
        '''
        
        # 今日の日付を取得
        datetime_today = datetime.date.today()
        
        # 今日のスタンプの更新
        user_rank = get_object_or_404(UserRank, user=user_id)
        today_data = DailyScore.objects.filter(user=user_id, created_at__range=(datetime_today, datetime_today+datetime.timedelta(days=1))).order_by('-created_at').first()
        if not today_data.achievement and user_rank.is_calories and user_rank.is_sleep and user_rank.is_steps:
            serializer = self.serializer_class(instance=today_data, data={'achievement': True}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        
        # １週間分のデータリスト
        achieve_week = list()
        date_week = list()
        
        # 過去７日間の日付
        date_range = [datetime_today - datetime.timedelta(days=i) for i in range(0, 7)]
        
        # １週間のデータを取得
        for date in date_range:
            daily_data =  DailyScore.objects.filter(user=user_id, created_at__range=(date, date+datetime.timedelta(days=1))).order_by('-created_at').first()
            if daily_data:
                achieve_week.append(daily_data.achievement)
            else:
                achieve_week.append(False)
            
            date_week.append(str(date).replace('-', ''))
            
        # response data
        return_data = {
            "stamp": achieve_week,
            "dateArray": date_week
        }
      
        return Response(data=return_data, status=status.HTTP_200_OK)

class WeekDataAPIView(views.APIView):
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        '''
        user_idに紐ずくユーザの1週間分のデータを返す
        
        レスポンス形式
        {
            "dataArray": {
                "steps": [int]
                "sleep": [int]
                "calorie": [int]
            },
            "dateArray": [str]
        }
        '''
        
        # １週間分のデータリスト
        steps_week = list()
        sleep_week = list()
        calories_week = list()
        date_week = list()
        
        # 今日の日付を取得
        datetime_today = datetime.date.today()
        # 過去７日間の日付
        date_range = [datetime_today - datetime.timedelta(days=i) for i in range(0, 7)]
        
        # １週間のデータを取得
        for date in date_range:
            daily_data =  DailyScore.objects.filter(user=user_id, created_at__range=(date, date+datetime.timedelta(days=1))).order_by('-created_at').first()
            
            if daily_data:
                steps_week.append(daily_data.steps)
                sleep_week.append(daily_data.sleep_score)
                calories_week.append(daily_data.calories)
                
            else: # データが取得できていない場合（fitbitをつけていない場合）
                steps_week.append(0)
                sleep_week.append(0)
                calories_week.append(0)
                
            date_week.append(str(date).replace('-', ''))
        
        # response data
        return_data = {
            "dataArray": {
                "steps": steps_week,
                "sleep": sleep_week,
                "calorie": calories_week,
            },
            "dateArray": date_week
        }
        
        return Response(data=return_data, status=status.HTTP_200_OK)
    
        
        
        
        
        
        
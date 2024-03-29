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
import pandas as pd
import random

from .models import User, DailyScore, UserGoal, UserRank
from .serializers import UserSerializer, DailyScoreSerializer, UserGoalSerializer, UserRankSerializer
from .update_token import updateToken


class FitbitAPIView(views.APIView):
    
    serializer_class = DailyScoreSerializer
    
    # 今日の日付を取得
    TODAY = datetime.date.today()
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        '''
        user_idに紐ずくユーザの今日のfitbitデータを返す
        
        レスポンス形式
        {
            'steps': [int],
	        'calories': [int],
	        'sleep': [int]
        }
        
        '''
        
        today_data = DailyScore.objects.filter(user=user_id, created_at__range=(self.TODAY, self.TODAY+datetime.timedelta(days=1))).order_by('-created_at').first()
        
        # response data
        return_data = {
            'steps': int(today_data.steps),
            'calorie': int(today_data.calories),
            'sleep': today_data.sleep_minutes
        }
        
        return Response(data=return_data, status=status.HTTP_200_OK)

class GoalsAPIView(views.APIView):
    
    serializer_class = UserGoalSerializer
    
    # 今日の日付を取得
    TODAY = datetime.date.today()
    
    def post(self, request: Request, *args, **kwargs):
        
        '''
        cronで日付が更新されたタイミングで全員分のUserGoalを作成
        
        レスポンス形式
        
        Userごとに
        {
            'user_id': str
            'steps_goal': int,
            'calories_goal': int
            'sleep_goal': int
        }
        
        '''
    
        user_all = User.objects.all()
        
        # response data
        return_data = list()
        
        # 全ユーザの今日の記録を更新
        for user in user_all:
            print(user.user_id)
             # ユーザ情報の取り出し
            client_obj = get_object_or_404(User, user_id=user.user_id)
            
            # FitbitでClient情報を取得
            client = fitbit.Fitbit(client_obj.client_id, client_obj.client_secret,
                        access_token = client_obj.access_token,
                        refresh_token = client_obj.refresh_token,
                        refresh_cb=updateToken)
            
            goals = client.make_request("https://api.fitbit.com//1/user/-/activities/goals/daily.json")['goals']
            goals['sleep'] = client.make_request("https://api.fitbit.com/1.2/user/-/sleep/goal.json")['goal']['minDuration']
            
            
            daily_goals = {"user": user.user_id, "sleep_goal": goals['sleep'], "steps_goal": goals['steps'], "calories_goal": goals['caloriesOut']}
            serializer = serializer = self.serializer_class(data=daily_goals)
            serializer.is_valid(raise_exception=True)
            serializer.save()
             
            return_data.append(daily_goals)
        
        return Response(data=return_data, status=status.HTTP_200_OK)
    
    
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
        user_goals = UserGoal.objects.filter(user=user_id, created_at__range=(self.TODAY, self.TODAY+datetime.timedelta(days=1))).order_by('-created_at').first()
        
        # response data
        return_data = {
            'steps': user_goals.steps_goal,
            'calorie': user_goals.calories_goal,
            'sleep' : user_goals.sleep_goal
        }
        
        return Response(data=return_data, status=status.HTTP_200_OK)
        
        
class DailyAPIView(views.APIView):
    
    serializer_class = DailyScoreSerializer
    
    # 今日の日付を取得
    TODAY = datetime.date.today()
    
    def post(self, request: Request, *args, **kwargs):
        
        '''
        cronで日付が更新されたタイミングで全員分のDailyScoreを作成
        
        レスポンス形式
        
        Userごとに
        {   
            "user_id": str
            "steps'": int,
	        "calories": int,
            "weight": float
            "sleep_score": int, 
            "sleep_minutes": int, 
        }
        
        '''
        
        user_all = User.objects.all()
        
        # response data
        return_data = list()
        
        # 全ユーザの今日の記録を更新
        for user in user_all:
            print(user.user_id)
            # FitbitでClient情報を取得
            client = fitbit.Fitbit(user.client_id, user.client_secret,
                        access_token = user.access_token,
                        refresh_token = user.refresh_token,
                        refresh_cb=updateToken)
            
            # 歩数とカロリーの取得
            daily_data = client.make_request("https://api.fitbit.com/1/user/-/activities/date/"+ str(self.TODAY) +".json")
            steps_daily = daily_data['summary']['steps']
            calories_daily = daily_data['summary']['caloriesOut']
            
            # 体重を取得
            user_weight = client.make_request("https://api.fitbit.com/1/user/-/profile.json")['user']['weight'] / 2.2046

            # 睡眠データ取得
            sleep_data = client.make_request("https://api.fitbit.com/1.2/user/-/sleep/date/"+ str(self.TODAY) +".json")['sleep']
            if sleep_data:
                # 睡眠効率を取得
                sleep_efficiency = sleep_data[0]['efficiency']
                # 睡眠時間を取得
                sleep_minutes = sleep_data[0]['minutesAsleep']
            else:
                sleep_efficiency = 0
                sleep_minutes = 0
            
            # fitbitを装着したかチェック
            # Get Daily Activity Summary
            active_data = client.make_request("https://api.fitbit.com/1/user/-/activities/date/"+ str(self.TODAY) +".json")['summary']
            print(active_data) # debug
            
            wearing = False
            
            # active_dataに心拍の記録がなければ装着していない
            if 'heartRateZones' in active_data:
                wearing = True
            
            
            data_daily = { "user": user.user_id, "sleep_score": sleep_efficiency, 'sleep_minutes': sleep_minutes, "steps": steps_daily, "calories": calories_daily, "weight": user_weight, "is_wearing": wearing }
            serializer = self.serializer_class(data=data_daily)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return_data.append(data_daily)
        
        return Response(data=return_data, status=status.HTTP_200_OK)
    
    def patch(self, request: Request, *args, **kwargs):
        
        '''
        cronで5分ごとにに全員分のDailyScoreを更新する
        
        レスポンス形式
        
        Userごとに
        {   
            "user_id": str
            "steps'": int,
	        "calories": int,
            "sleep_score": int, 
            "sleep_minutes": int, 
        }
        
        '''
        
        user_all = User.objects.all()
        
        # response data
        return_data = list()
        
        # 全ユーザの今日の記録を更新
        for user in user_all:
            print(user.user_id)
            # FitbitでClient情報を取得
            client = fitbit.Fitbit(user.client_id, user.client_secret,
                        access_token = user.access_token,
                        refresh_token = user.refresh_token,
                        refresh_cb=updateToken)
            
            # 歩数とカロリーの取得
            daily_data = client.make_request("https://api.fitbit.com/1/user/-/activities/date/"+ str(self.TODAY) +".json")
            steps_daily = daily_data['summary']['steps']
            calories_daily = daily_data['summary']['caloriesOut']
            
    
            today_data = DailyScore.objects.filter(user=user.user_id, created_at__range=(self.TODAY, self.TODAY+datetime.timedelta(days=1))).order_by('-created_at').first()
            
            sleep_data = client.make_request("https://api.fitbit.com/1.2/user/-/sleep/date/"+ str(self.TODAY) +".json")['sleep']
            if sleep_data:
                # 睡眠効率を取得
                sleep_efficiency = sleep_data[0]['efficiency']
                # 睡眠時間を取得
                sleep_minutes = sleep_data[0]['minutesAsleep']
            else:
                sleep_efficiency = 0
                sleep_minutes = 0
            
            
            # 今日のデータの更新
            serializer = self.serializer_class(instance=today_data, data={"steps": steps_daily, "sleep_score": sleep_efficiency, "sleep_minutes": sleep_minutes, "calories": calories_daily}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            
            return_data.append({
                "user_id": user.user_id,
                "steps": steps_daily, 
                "sleep_score": sleep_efficiency, 
                "sleep_minutes": sleep_minutes, 
                "calories": calories_daily
            })
            
        
        return Response(data=return_data, status=status.HTTP_200_OK)
    
    
    
class RankAPIView(views.APIView):
    
    serializer_class = UserRankSerializer
    
    # 今日の日付を取得
    TODAY = datetime.date.today()
    
    def patch(self, request: Request, *args, **kwargs):
        
        '''
        cronで日付が更新されたタイミングでuser_idに紐ずくユーザのランク更新
        
        レスポンス形式
        
        Userごとに
        {
            "user_id": str
            "level": int
        }
        '''
        
        user_all = User.objects.all()
        
        # response data
        return_data = list()
        
        # 全ユーザの今日の記録を更新
        for user in user_all:
            print(user.user_id)
            
            # 昨日の達成したrateを取得
            user_rank = get_object_or_404(UserRank, user=user.user_id)
            rate = user_rank.rate
            
            data_update = {
                'rank': int(user_rank.rank + rate),
                'rate': 0,
            }
            
            # データの更新
            serializer = self.serializer_class(instance=user_rank, data=data_update, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            
            return_data.append({
                "user_id": user.user_id,
                "level": int(user_rank.rank)
            })
            
        
        return Response(data=return_data, status=status.HTTP_200_OK)
    
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        '''
        user_idに紐ずくユーザのランクと経験値を返す
        
        レスポンス形式
        {
            "level": int
            "rate": float
        }
        '''
        
        # 現在のデータを取得
        today_data = DailyScore.objects.filter(user=user_id, created_at__range=(self.TODAY, self.TODAY+datetime.timedelta(days=1))).order_by('-created_at').first()
        
        # 目標値を取得
        user_goal = UserGoal.objects.filter(user=user_id, created_at__range=(self.TODAY, self.TODAY+datetime.timedelta(days=1))).order_by('-created_at').first()
        
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
            is_sleep = True
            
        if rate_steps >= 1 and not is_steps:
            is_steps = True
        
        if rate_calories >= 1 and not is_calories:
            is_calories = True
        
        data = {
            'rate': rate,
            'is_sleep': is_sleep,
            'is_steps': is_steps,
            'is_calories': is_calories,
        }
        
        # update db
        serializer = self.serializer_class(instance=user_rank, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        
        # response data
        return_data = {
            'level': rank,
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
        date_range = sorted([datetime_today - datetime.timedelta(days=i) for i in range(0, 7)])
        
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
            "date_array": date_week
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
        date_range = sorted([datetime_today - datetime.timedelta(days=i) for i in range(0, 7)])
        
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
            "data_array": {
                "steps": steps_week,
                "sleep": sleep_week,
                "calorie": calories_week,
            },
            "date_array": date_week
        }
        
        return Response(data=return_data, status=status.HTTP_200_OK)
    
    
class StepPerHourAPIView(views.APIView):
        
    # 今日の日付を取得
    TODAY = datetime.date.today()
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
    
        '''
        user_idに紐ずくユーザの1時間ごとの歩数データを返す
        
        レスポンス形式
        {
            "steps": [int] // 6:00 ~ 20:00
            "goals": [int]
        }
        '''
        
        
        # ユーザ情報の取り出し
        client_obj = get_object_or_404(User, user_id=user_id)
        
        # FitbitでClient情報を取得
        client = fitbit.Fitbit(client_obj.client_id, client_obj.client_secret,
                    access_token = client_obj.access_token,
                    refresh_token = client_obj.refresh_token,
                    refresh_cb=updateToken)
        
        # 成人男性の1日の平均歩数データ
        adult_step_data = [80, 400, 1840, 400, 80, 80, 800, 80, 80, 80, 400, 1760, 1680, 800, 80]
        
        # 今日の目標値
        steps_goal = adult_step_data
        
        
        #### 過去のデータ #####
        
        # 過去７日間の日付
        date_range = sorted([self.TODAY - datetime.timedelta(days=i) for i in range(1, 7)])
        
        # # 過去１週間のデータを取得
        for date in date_range:
            daily_data =  DailyScore.objects.filter(user=user_id, created_at__range=(date, date+datetime.timedelta(days=1))).order_by('-created_at').first()
            # 目標を達成していたかどうか
            if daily_data and daily_data.achievement:
                
                # 過去の歩数データを取得
                step_data_ago = client.intraday_time_series('activities/steps', base_date=date, detail_level='15min', start_time="06:00", end_time="20:00")["activities-steps-intraday"]["dataset"]
                # transfer DataFrame
                df_step_data_ago = pd.DataFrame.from_dict(step_data_ago)
                # timeにindexを貼る
                df_step_data_ago.index = df_step_data_ago["time"]
                
                # 過去の１時間ごとの歩数データリスト
                steps_ago = list()
                
                for i in range(14):
                    # 取得時刻の開始と終了
                    start_time = datetime.time(6+i, 0, 0)
                    end_time = datetime.time(7+i, 0, 0)
                    
                    # datetimeをstrに変換
                    str_start_time = start_time.strftime("%H:%M:%S")
                    str_end_time = end_time.strftime("%H:%M:%S")
                    
                    # １時間の歩数データ
                    df_step_hour_ago = df_step_data_ago[str_start_time : str_end_time]
                    steps_ago.append(df_step_hour_ago['value'].sum())
                
                steps_goal = steps_ago
                
                # 近日のデータが取れたのでループを抜ける
                break
                
                
        
        #### 今日のデータ #####
        
        # 1日の歩数データを取得
        step_data = client.intraday_time_series('activities/steps', base_date=str(self.TODAY), detail_level='15min', start_time="06:00", end_time="20:00")["activities-steps-intraday"]["dataset"]
        # transfer DataFrame
        df_step_data = pd.DataFrame.from_dict(step_data)
        # timeにindexを貼る
        df_step_data.index = df_step_data["time"]
        
        # １時間ごとの歩数データリスト
        steps = list()
       
        for i in range(14):
            # 取得時刻の開始と終了
            start_time = datetime.time(6+i, 0, 0)
            end_time = datetime.time(7+i, 0, 0)
            
            # datetimeをstrに変換
            str_start_time = start_time.strftime("%H:%M:%S")
            str_end_time = end_time.strftime("%H:%M:%S")
            
            # １時間の歩数データ
            df_step_hour = df_step_data[str_start_time : str_end_time]
            steps.append(df_step_hour['value'].sum())
            
        
        # response data
        return_data = {
            'steps': steps,
            'goals': steps_goal
        }
                        
        return Response(data=return_data, status=status.HTTP_200_OK)
        
    

class RecommendExerciseAPIView(views.APIView):
    
    # 今日の日付を取得
    TODAY = datetime.date.today()
    
    def get(self, request: Request, user_id: str,  *args, **kwargs):
        
        '''
        user_idに紐ずくユーザにおすすめの運動とその時間を返す
        
        レスポンス形式
        {
            "exercise": str
            "time": int [分]
        }
        
        '''
        
        user_daily = DailyScore.objects.filter(user=user_id, created_at__range=(self.TODAY, self.TODAY+datetime.timedelta(days=1))).order_by('-created_at').first()
        
        # 今日のカロリー消費を取得
        user_calories_today = user_daily.calories
        
        # 体重を取得
        user_weight = user_daily.weight
        
        if user_weight > 0:
        
        # カロリー消費の目標値を取得
            user_goal = (UserGoal.objects.filter(user=user_id, created_at__range=(self.TODAY, self.TODAY+datetime.timedelta(days=1)))
                            .order_by('-created_at').values('calories_goal').first())['calories_goal']

            # 今日の残りの [METs・時] 算出
            # METs : 運動強度
            # 1MET=3.5mL/kg/分の酸素摂取量
            mets_hour = (user_goal - user_calories_today - 500) / user_weight
            # mets_hour = (user_goal - user_calories_today) / user_weight
            
            # 各運動のMETs
            exercise = {
                'run': 11.5,
                'walk': 8.0,
                'fastwalk': 8.8,
                'cycling': 13.5,
                'training': 9.0,
            }
            # exercise = {
            #     'run': 7.0,
            #     'walk': 3.0,
            #     'fastwalk': 4.3,
            #     'cycling': 8.0,
            #     'training': 3.5,
            # }
            
            # 勧める運動とその時間を格納
            recommend_exercise = dict()
            
            # response data
            return_data = dict()
            
            # 目標を達成していない場合
            if mets_hour > 0:
                
                # 各運動を行うべき時間を格納
                for name, METs in exercise.items():
                    minutes = int(mets_hour / METs * 60)
                    if minutes < 60:
                        #  １時間以内で勧めれる運動であれば [分] で格納
                        recommend_exercise[name] = minutes
                
                # １時間以内で可能な運動からランダムに選択
                # 最適化させたい
                if len(recommend_exercise.items()):
                    return_data['exercise'], return_data['time'] =  random.choice(list(recommend_exercise.items()))
                else:
                    return_data['exercise'] = 'cycling'
                    return_data['time'] = int(mets_hour / exercise['cycling'] * 60)

            # 目標を達成している場合
            else:
                return_data['exercise'] = 'done'
                return_data['time'] = -1
                
        # 体重を設定してない場合
        else:
            # response data
            return_data = {
                "exercise": '',
                'time': -1
            }
            
        return Response(data=return_data, status=status.HTTP_200_OK)
    
class FitbitWearCheckAPIView(views.APIView):
    
    # 今日の日付を取得
    TODAY = datetime.date.today()
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        '''
        user_idに紐付けられたuserが今日Fitbitを装着しているかを返す
        
        レスポンス形式
        {
            "wearing": bool
        }
        
        '''
        
        # 今日のデータを取得
        today_data =  DailyScore.objects.filter(user=user_id, created_at__range=(self.TODAY, self.TODAY+datetime.timedelta(days=1))).order_by('-created_at').first()
            
        # response data
        return_data = {
            "wearing": today_data.is_wearing
        }
        
        return Response(data=return_data, status=status.HTTP_200_OK)
    

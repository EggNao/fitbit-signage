from turtle import update
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

from .models import User, DailyScore
from .serializers import UserSerializer, DailyScoreSerializer
from .update_token import updateToken


class GoalsAPIView(views.APIView):
    
    # 今日の日付を取得
    TODAY = str(datetime.date.today())
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        # ユーザ情報の取り出し
        client_obj = get_object_or_404(User, user_id=user_id)
        # FitbitでClient情報を取得
        client = fitbit.Fitbit(client_obj.client_id, client_obj.client_secret,
                       access_token = client_obj.access_token,
                       refresh_token = client_obj.refresh_token,
                       refresh_cb=updateToken)
        
        # 目標の取得
        goals = client.make_request("https://api.fitbit.com//1/user/-/activities/goals/daily.json")['goals']
        
        # Response Data
        return_data = {
            'steps': goals['steps'],
            'calories': goals['caloriesOut'],
        }
        
        return Response(data=return_data, status=status.HTTP_200_OK)
        
        

class FitbitAPIView(views.APIView):
    
    serializer_class = DailyScore
    
    # 今日の日付を取得
    TODAY = str(datetime.date.today())
    
    def get(self, request: Request, user_id: str, *args, **kwargs):
        
        # ユーザ情報の取り出し
        client_obj = get_object_or_404(User, user_id=user_id)
        # FitbitでClient情報を取得
        client = fitbit.Fitbit(client_obj.client_id, client_obj.client_secret,
                       access_token = client_obj.access_token,
                       refresh_token = client_obj.refresh_token,
                       refresh_cb=updateToken)
        
        # 今日まだ取得していない場合
        # fitbit-APIで睡眠効率を取得
        sleep_efficiency = client.make_request("https://api.fitbit.com/1.2/user/-/sleep/date/"+ self.TODAY +".json")['sleep'][0]['efficiency']
        
        # 歩数の取得
        steps_daily = client.make_request("https://api.fitbit.com/1/user/-/activities/steps/date/"+ self.TODAY +"/1d/15min.json")["activities-steps"][0]["value"]
        
        # カロリーの取得
        calories_daily = client.make_request("https://api.fitbit.com/1/user/-/activities/calories/date/"+ self.TODAY +"/1d/15min.json")["activities-calories"][0]["value"]
        
        # Response Data
        return_data = {
            'steps': steps_daily,
            'calories': calories_daily,
            'sleep_efficiency': sleep_efficiency,
        }
        
        return Response(data=return_data, status=status.HTTP_200_OK)
        

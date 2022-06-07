from django.shortcuts import get_object_or_404

from .models import User
from .serializers import UserSerializer

def updateToken(token):
    
    # tokenからの取り出し
    user_id = token['user_id']
    access_token = token['access_token']
    refresh_token = token['refresh_token']
    print(token) # debug
    
    # update db
    instance = get_object_or_404(User, user_id=user_id)
    print(instance.access_token) # debug
    serializer = UserSerializer(instance=instance, data={'access_token': access_token, 'refresh_token': refresh_token}, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    print(get_object_or_404(User, user_id=user_id).access_token) # debug
    
    return
    
    
    
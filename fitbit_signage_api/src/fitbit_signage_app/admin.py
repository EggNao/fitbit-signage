from django.contrib import admin
from .models import User, DailyScore, UserGoal, UserRank

admin.site.register(User)
admin.site.register(DailyScore)
admin.site.register(UserGoal)
admin.site.register(UserRank)


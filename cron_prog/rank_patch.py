import requests
import datetime

dt_now = datetime.datetime.now()

try:
    url="http://localhost:8000/week/rank/"
    r = requests.patch(url).json()
    print(str(dt_now) + ' : ' + str(r))

except Exception as e:
    print(e)

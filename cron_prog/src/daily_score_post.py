import requests
import datetime

dt_now = datetime.datetime.now()

try:
    url="http://localhost:8000/fitbit/"
    r = requests.post(url).json()
    print(str(dt_now) + ' : ' + str(r))

except Exception as e:
    print(e)
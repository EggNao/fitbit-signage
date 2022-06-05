import requests

try:
    url="http://localhost:8000/fitbit/"
    r = requests.patch(url).json()
    print(r)

except Exception as e:
    print(e)

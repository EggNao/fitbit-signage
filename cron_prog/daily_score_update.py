import requests

try:
    url="http://localhost:8000/fitbit"
    r = requests.get(url+"/9YHK8W").json()
    print("fitbit request success")
    print(r)

except Exception as e:
    print(e)

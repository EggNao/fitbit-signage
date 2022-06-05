import requests

try:
    url="http://localhost:8000/fitbit"
    r = requests.post(url+"/")
    #if(r.form['ret']=="ok"):#きちんと送信できたか確認できるように！
    print("susess")

except Exception as e:
    print(e)

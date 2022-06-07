#!/bin/sh

echo "--------------------------------------"
echo "-- every_5min_cron.sh （個人のfitbitデータ更新）--"
echo "--------------------------------------"

# 実行プログラムのあるディレクトリに移動
cd fitbit-signage/cron_prog/src

# 全ユーザのdaily_scoreを更新
/Users/ryuseifujimoto/.asdf/shims/python daily_score_patch.py
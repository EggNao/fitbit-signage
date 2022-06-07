#!/bin/sh

echo "--------------------------------------"
echo "-- daily_cron.sh (個人のデータの作成と変更値の変更)--"
echo "--------------------------------------"

# 実行プログラムのあるディレクトリに移動
cd fitbit-signage/cron_prog/src

# 全ユーザのdaily_scoreの作成
/Users/ryuseifujimoto/.asdf/shims/python daily_score_post.py

# 全ユーザのレベルを更新
/Users/ryuseifujimoto/.asdf/shims/python rank_patch.py

# 全ユーザの目標値を更新
/Users/ryuseifujimoto/.asdf/shims/python user_goal_post.py

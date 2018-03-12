#! /bin/bash
# fuser -k 4040/tcp
# fuser -k 5050/tcp
# fuser -k 6060/tcp

# service redis_6379 start
#pip install -r requirements.txt
cd ./backend_server
python2 service.py &
cd ../news_recommendation_service
python2 click_log_processor.py &
python2 recommendation_service.py
# cd ../news_topic_modeling_service/server
# python2 server.py &

echo“====================================”
read -p "PRESS [ENTER] TO TERMINATE PROCESSES" PRESSKEY

sudo fuser -k 4040/tcp
sudo fuser -k 5050/tcp
sudo fuser -k 6060/tcp
sudo service redis_6379 stop
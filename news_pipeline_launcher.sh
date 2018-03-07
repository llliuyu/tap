#!/bin/bash
# service redis_6379 start
# service mongod start

# pip2 install -r requirements.txt

cd news_pipeline
python2 news_monitor.py &
python2 news_fecher.py &
python2 news_deduper.py &

echo "=================================================="
read -p "PRESS [ANY KEY] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)
# -*- coding: utf-8 -*-
import logging
import json
import os
import pickle
import random
import redis
import sys
import pymongo
from pymongo import IndexModel

from bson.json_util import dumps
from datetime import datetime
from dateutil import tz

# Auto-detect zones:
from_zone = tz.tzutc()
to_zone = tz.tzlocal()

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
import news_recommendation_service_client

from cloudAMQP_client import CloudAMQPClient

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

NEWS_TABLE_NAME = 'news-test'
CLICK_LOGS_TABLE_NAME = 'click_logs'

NEWS_LIMIT = 200
NEWS_LIST_BATCH_SIZE = 10
USER_NEWS_TIME_OUT_IN_SECONDS = 60

LOG_CLICKS_TASK_QUEUE_URL = 'amqp://zylpcqxg:s5PL0DqsrTDwjtFym_nVZSW8-CBzVjE0@donkey.rmq.cloudamqp.com/zylpcqxg'
LOG_CLICKS_TASK_QUEUE_NAME = 'tap-news-log-clicks-task-queue'

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT, db=0)
cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)

def getNewsSummariesForUser(user_id, page_num, user_ip):
    page_num = int(page_num)
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

# The final list of news to be returned.
    sliced_news = []

    if redis_client.get(user_id) is not None:
        news_digests = pickle.loads(redis_client.get(user_id))

        # If begin_index is out of range, this will return empty list;
        # If end_index is out of range (begin_index is within the range), this
        # will return all remaining news ids.
        sliced_news_digests = news_digests[begin_index:end_index]
        print sliced_news_digests
        db = mongodb_client.get_db()
        sliced_news = list(db[NEWS_TABLE_NAME].find({'digest': {'$in': sliced_news_digests}}))
    else:
        db = mongodb_client.get_db()
        total_news = list(db[NEWS_TABLE_NAME].find().sort([('publishedAt', -1)]).limit(NEWS_LIMIT))
        total_news_digests = map(lambda x: x['digest'], total_news)

        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIME_OUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]

    # Get preference for the user
    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
   
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in sliced_news:
        # Remove text field to save bandwidth.
        del news['text']
        if news.get('class') == topPreference:
            news['reason'] = 'Recommend'
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'
        else:
            news['time'] = str(news['publishedAt'].date())
    
    return json.loads(dumps(sliced_news))

'''def sortPreference(preference):
    
    return sorded(preference.items(), key=lambda item:item[1],reverse)'''



def logNewsClickForUser(user_id, news_id, user_ip):
    message = {'userId': user_id, 'newsId': news_id, 'timestamp': datetime.utcnow()}

    db = mongodb_client.get_db()
    db[CLICK_LOGS_TABLE_NAME].insert(message)

    # Send log task to machine learning service for prediction
    message = {'userId': user_id, 'newsId': news_id, 'timestamp': str(datetime.utcnow())}
    cloudAMQP_client.sendMessage(message)

    # logging.basicConfig(level=logging.INFO,
    #             format='%(asctime)s %(filename)s%(message)s',
    #             datefmt='%a %d %b %Y %H:%M:%S' + ',',
    #             filename='../logging/user_requests.log',
    #             filemode='a')
    # logging.info(', ' +
    #              'event_name : ' + 'news_request' + ', ' + 
    #              'user_id : ' + str(user_id) + ', ' +
    #              'user_ip : ' + str(user_ip) + ', ' +
    #              'news_id : ' + str(news_id)) 

def getSearchNewsSummariesForUser(user_id, page_num, search_key):
    db = mongodb_client.get_db()
    #connect to our cluster
    page_num = int(page_num)
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE
    print 'getSearchNewsSummariesForUser, pageNum: %s' % page_num
    print 'begin_index: %s' % begin_index
    print 'end_index: %s' % end_index
    sliced_news = []
    #Get preference for the user_id
    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None
    if preference is not None and len(preference) > 0:
        topPreference = preference[0]
    if redis_client.get(search_key) is not None:
        #print "len %s" % len(redis_client.get(search_key))
        #print "end_index %s" % end_index
        news_search_digests = pickle.loads(redis_client.get(search_key))
        sliced_search_news_digests = news_search_digests[begin_index:end_index]
        #print 'news_digests %s' % news_digests
        #print 'redis sliced_news begin_index end_index: %s %s %s' % (sliced_news_digests,begin_index,end_index)
        sliced_search_news = list(db[NEWS_TABLE_NAME].find({'digest':{'$in':sliced_search_news_digests}}).sort([('publishedAt', -1)]))
    else:
        try:
            # ,('description', pymongo.TEXT),('text', pymongo.TEXT),('class', pymongo.TEXT)
            db[NEWS_TABLE_NAME].create_index([('title', pymongo.TEXT),('description', pymongo.TEXT),('text', pymongo.TEXT),('class', pymongo.TEXT)])
            for index in db[NEWS_TABLE_NAME].list_indexes():
                print(index)
            total_search_news = list(db[NEWS_TABLE_NAME].find({"$text": {"$search": search_key}}))
            print len(total_search_news)
            # result = list(db[NEWS_TABLE_NAME].find({"$text": {"$search": search_key}}, {"score": {"$meta": "toextScore"}}).sort({"score":{"$meta":"textScore"}}))
            # print len(result)
        except Exception as e:
            print str(e)
        
        total_search_news_digest = map(lambda x:x['digest'], total_search_news)
        redis_client.set(search_key, pickle.dumps(total_search_news_digest))
        redis_client.expire(search_key, USER_NEWS_TIME_OUT_IN_SECONDS)
        sliced_search_news = total_search_news[begin_index:end_index]
        
    for news in sliced_search_news:
        del news['text']
        if news['publishedAt'].replace(tzinfo=from_zone).astimezone(to_zone).date()== datetime.today().date():
            news['time'] = 'today'
        else:
            news['time'] = news['publishedAt'].replace(tzinfo=from_zone).astimezone(to_zone).date().strftime("%A %d. %B %Y")

        if news['class'] == topPreference and news['time'] == 'today':
            news['reason'] = 'Recommend'
    #print 'after sliced_news %s' % sliced_news
    return json.loads(dumps(sliced_search_news))
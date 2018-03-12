import requests

from json import loads

NEWS_API_ENDPOINT = 'https://newsapi.org/v1/'
NEWS_API_KEY = '0353d2bca33c44d1ad3acf84f577e272'

ARTICLES_API = 'articles' 

DEFAULT_SOURCES = ['bbc-news', 'cnn']

SORT_BY_TOP = 'top'


def buildUrl(endPoint=NEWS_API_ENDPOINT, apiName=ARTICLES_API):
    return endPoint + apiName


def getNewsFromSource(sources=DEFAULT_SOURCES, sortBy=SORT_BY_TOP):
    articles = []

    for source in sources:
        payload = { 
            'apiKey': NEWS_API_KEY,
            'source': source,
            'sortBy': sortBy
        }

        response = requests.get(buildUrl(), params=payload)

        res_json = loads(response.content)

        # extract infor from response
        if(res_json is not None and
        res_json['status'] == 'ok' and
        res_json['source'] is not None):
            # populate news source in each articles
            for news in res_json['articles']:
                news['source'] = res_json['source']

            articles.extend(res_json['articles'])

    return articles
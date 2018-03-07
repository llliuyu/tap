from elasticsearch import Elasticsearch

def get_elastic():
  es = Elasticsearch(['localhost'], http_auth= ('elastic','changeme'), port=9200)
  return es

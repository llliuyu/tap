var express = require('express');
var router = express.Router();
var rpc_client = require('../rpc_client/rpc_client')
var logging = require('../logging/logging');

/* GET news summary list. */
router.get('/userId/:userId/pageNum/:pageNum', function(req, res, next) {
  
  user_id = req.params['userId']
  page_num = req.params['pageNum']
  console.log(req.connection.remoteAddress)
  logging.info(req.connection.remoteAddress);
  user_ip = req.connection.remoteAddress
  rpc_client.getNewsSummariesForUser(user_id, page_num, user_ip, function(response){
    res.json(response);
  });
});


router.post('/userId/:userId/newsId/:newsId', function(req, res, next) {
  
  user_id = req.params['userId'];
  news_id = req.params['newsId']

  rpc_client.logNewsClickForUser(user_id, news_id, user_ip);
  res.status(200);
  console.log('Logging news click' + ' from ' + user_id);
  logging.info('Logging news click' + ' from ' + user_id);
});

module.exports = router;
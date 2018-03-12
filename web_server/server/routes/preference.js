var express = require('express');
var router = express.Router();
var rpc_client = require('../rpc_client/rpc_client')

/* GET news listing. */
router.get('/userId/:userId', function(req, res, next) {
  //console.log('Feteching news......');
  user_id = req.params['userId'];

  rpc_client.getPreference(user_id, function(response){
    res.json(response);
  })
 });

module.exports = router;

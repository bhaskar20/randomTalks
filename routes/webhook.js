var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.query['hub.verify_token'] === 123) {
    res.send(req.query['hub.challenge']);
  } else {
  	console.log("failed token verification");
    res.send('Error, wrong validation token');    
  }
});



module.exports = router;

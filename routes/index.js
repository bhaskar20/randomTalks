var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.send({"message":"Sorry this is reserved for now"});
});

module.exports = router;

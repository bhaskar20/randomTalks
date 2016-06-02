var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  res.send({"message":"Sorry this is reserved for now"});
});

router.get('/policy',function(req, res){
	var pa = path.join(__dirname+"/../public/views/policy.html");
	res.sendFile(pa);
});

module.exports = router;

//
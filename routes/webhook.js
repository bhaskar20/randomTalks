var express = require('express');
var router = express.Router();
var helper = require("../helper/helper.js");

router.get('/', function(req, res) {
  if (req.query['hub.verify_token'] === "Random_talks_secured") {
    res.send(req.query['hub.challenge']);
  } else {
  	console.log("failed token verification");
    res.send('Error, wrong validation token');    
  }
});

router.post('/', function (req, res) {
    var events = req.body.entry[0].messaging;
    console.log(events);
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
        	console.log("HERE IS THE MESSAGE ===>> ");
            console.log(event);
            console.log(events.message);
        	//do soemthing here
            helper.sendMessage(event.sender.id,"Echo: "+event.message.text);
        }
    }
    res.sendStatus(200);
});



module.exports = router;

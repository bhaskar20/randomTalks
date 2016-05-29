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
    for(j=0; j<req.body.entry.length; j++){
        var events = req.body.entry[j].messaging;
        console.log(events);
        console.log("=====================");
        for (i = 0; i < events.length; i++) {
            var event = events[i];
            if (event.message && event.message.text) {
            	//do soemthing here
                var text = "Echo: "+event.message.text;
                helper.sendMessage(event.sender.id,text,function(err){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("sent");
                    }
                });
            }
        }
        res.status(200).send();
    }
});



module.exports = router;

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
                helper.userStatus(event.sender.id, event, function(err, event, status) {
                    if (err) {
                        console.log("ERR ====>> "+err.message);
                        return;
                    }
                    if (status == false) {
                        helper.log();
                        console.log("new user");
                        //register the user and enter in a conv
                        helper.saveUser(event.sender.id, event, function(err, event, docs){
                            if (err) {
                                console.log("ERR ====>> "+err.message)
                                return;
                            }
                            console.log("user saved");
                            helper.setupChat(event.sender.id, event, function(err, event, doc){
                                if (err) {
                                    console.log("ERR ====>> "+err.message);
                                    return;
                                }
                                console.log("setup done");
                                if (doc) {
                                    console.log(doc);
                                    console.log("partner found");
                                    helper.log();
                                    helper.sendMessage(doc, "hi", function(err) {
                                        if (err) {
                                            console.log("ERR ====>> "+err.message);
                                        }
                                        console.log("hi sent");
                                    });
                                    helper.sendMessage(event.sender.id, "hi", function(err){
                                       if (err) {
                                            console.log("ERR ====>> "+err.message);
                                        } 
                                    });
                                }
                            });
                        });
                    } else if (status == "live"){
                        console.log("user already in conv");
                        // find partner and send the message
                        if(event.sender.message != "@botbye") {
                            var partner = helper.userConv[event.sender.id];
                            var message = event.message.text;
                            helper.sendMessage(partner, text, function(err){
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(" message sent");
                                }
                            });
                        } else {
                            helper.unsetChat(event.sender.id, event, function(err, event, doc){
                                if (err) {
                                    console.log("ERR ====>> "+err.message)
                                }
                                console.log("user left the chat "+doc+"--"+event.sender.id);
                            });
                        }
                    } else {
                        switch(event.message.text) {
                            case "@botHi":
                            case "@botHii":
                            case "@bothii":
                            case "@bothi":
                            console.log("waiting user");
                            //do something, setup the chat
                                helper.setupChat(event.sender.id, event, function(err, event, doc){
                                    if (err) {
                                        console.log("ERR ====>> "+err.message);
                                        return;
                                    }
                                    console.log("waiting user setup done");
                                    helper.log();
                                    if (doc) {
                                        helper.sendMessage(doc, "hi", function(err) {
                                            if (err) {
                                                console.log("ERR ====>> "+err.message);
                                            }
                                        });
                                        helper.sendMessage(event.sender.id, "hi", function(err){
                                           if (err) {
                                                console.log("ERR ====>> "+err.message);
                                            }
                                            console.log("waiting user chat hi"); 
                                        });
                                    }
                                });
                                return;
                        }
                    }
                })
            }
        }
    }
    res.status(200).send();
});



module.exports = router;

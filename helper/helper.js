var request = require("request");
var db = require("../db/db");
var helper = {};

helper.userQ = [];
helper.userConv = {};
helper.sendMessage = function(id, msg, cb) {
	request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: id},
            message: { text : msg }
        }
    }, function(error, response, body) {
        if (error) {
            //console.log('Error sending message: ', error);
            cb("err");
        } else if (response.body.error) {
            //console.log('Error: ', response.body.error);
            cb("err");
        } else {
        	//console.log("sent");
        	cb()
        }
    });
    return;
}
helper.setupChat = function(id, e, cb){
    if (helper.userQ[0] != id ) {
        if (helper.userQ.length > 0) {
            var partner = helper.userQ.shift();
            //add in conversation
            helper.userConv[partner] = id;
            helper.userConv[id] = partner;
            var users = db.get().collection("users");
            users.update({
                uid: 
                    {
                        $in :[id, partner]
                    }
                },{
                    $set : {
                        status : "live"
                    }    
                },
                {
                    multi : true
                }, function(err, docs){
                    if (err) {
                        cb(err);
                    }
                    cb(null, e , partner);
                })
        } else {
            helper.userQ.push(id);
            cb(null, e, null);
        }
    }
}
helper.unsetChat = function(id, e, cb){
    var partner = userConv[id];
    delete helper.userConv[partner];
    delete helper.userConv[id];
    var users = db.get().collection("users");
    users.update({
        uid: 
            {
                $in :[id, partner]
            }
    },{
        $set : {
            status : "waiting"
        }    
    },
    {
        multi : true
    }, function(err, docs){
        if (err) {
            cb(err);
        }
        cb(null, e , partner);
    });
}
helper.saveUser = function(id, e, cb){
    var users = db.get().collection("users");
    //get info on user
    obj = {};
    users.insert({
        uid:id,
        info:obj,
        status:"waiting"
    }, function(err, docs){
        if (err) {
            cb(err);
        }
        cb(null, e, docs[0]);
    });
}
/*
user = {
    uid = number,
    info = {
        age:number
        etc
    }
    status = live/waiting,    
}
*/
helper.log = function(){
    var users = db.get().collection("users");
    users.find().toArray(function(err, docs){
        console.log(docs);
        console.log(helper.userQ);
        console.log(helper.userConv);
    })
}
helper.userStatus = function(id, e, cb){
    var users = db.get().collection("users");
    users.find({uid:id}).toArray(function(err, docs){
        if (err) {
            cb(err);
        }
        if (docs.length > 1) {
            cb(new Error("Multiple users with same id"));
        }
        if (docs.length == 0) {
            cb(null, e, false);
        } else {
            var status = docs[0].status;
            cb(null, e, status);
        }
    })
}

module.exports = helper;
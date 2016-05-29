var request = require("request");
var helper = {};

helper.sendMessage = function(id,msg,cb) {
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

module.exports = helper;
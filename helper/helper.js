var request = require("request");
var helper = {};

helper.sendMessage = function(id,msg) {
	console.log(id,msg);
	console.log(process.env.PAGE_ACCESS_TOKEN);
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
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        } else {
        	console.log("sent");
        }
    });
}

module.exports = helper;
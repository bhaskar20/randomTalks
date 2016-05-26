var db = require("../db/db.js")

var url = 'mongodb://localhost:27017/randomTalks';

var exit = function(db) {
    db.close();
    process.exit();
};

db.connect(url, function(err, db){
	if (err) {
		console.log("connection to db failed");
	}
	var users = db.collection("users");
	users.insert({"name":"Sample","status":"Active","dob":"XX"},function(err, doc) {
		if (err) {
			console.log(err);
			exit(db);
		} else {
			console.log("done");
			exit(db);
		}
	})
});

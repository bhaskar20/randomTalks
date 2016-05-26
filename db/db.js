var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
};

exports.connect = function(url, done) {
  if (state.db) return done();

  MongoClient.connect(url, function(err, db) {
    if (err) return done(err);
    state.db = db;
    done(null, db);
  });
}

exports.get = function() {
  return state.db;
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null;
      state.mode = null;
      done(err);
    })
  }
};

exports.create = function(name, done) {
  if (state.db) {
    state.db.createCollection(name,{});
  } else {
    console.log("no db")
  }
}
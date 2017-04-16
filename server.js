var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");
var assert = require("assert");
var waitForMongo = require("wait-for-mongo");

var app = express();
app.use(cors());

waitForMongo("mongodb://localhost/venturerealm", {
	timeout: 1000 * 60 * 2
}, function(err) {
	if (err) {
		console.log("Timeout exceeded");
	} else {
		MongoClient.connect("mongodb://localhost:27017/venturerealm", function(err, db) {
			assert.equal(null, err);
			console.log("Connected to server");

			// Serve static files
			app.use(express.static("public"));

			app.listen(8000, function() {
				console.log("Listening on :8000");
			});

			db.close();
		});
	}
});

var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");
var assert = require("assert");
var waitForMongo = require("wait-for-mongo");

var app = express();
app.use(cors());

connectToMongo();

function connectToMongo() {
	MongoClient.connect("mongodb://localhost:27017/venturerealm", function(err, db) {
		if (err) {
			connectToMongo();
		}

		console.log("Connected to server");

		// Serve static files
		app.use(express.static("public"));

		app.listen(8000, function() {
			console.log("Listening on :8000");
		});

		db.close();
	});
}

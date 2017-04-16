var express = require("express");
var cors = require("cors");
var app = express();

var MongoClient = require("mongodb").MongoClient;
var Server = require("mongodb").Server;

app.use(cors());

app.listen(8000, function() {
	console.log("Listening on 8000");
});

// Serve static files
app.use(express.static("public"));

MongoClient.connect("mongodb://localhost:27017/venturerealm", {
	native_parser: true
}, function(err, db) {
	// assert.equal(null, err);

	db.collection("map").update({
		a: 1
	}, {
		b: 1
	}, {
		upsert: true
	}, function(err, result) {
		// assert.equal(null, err);
		// assert.equal(1, result);

		db.close();
	});
});

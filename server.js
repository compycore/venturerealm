var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");
var process = require("process");
var waitForMongo = require("wait-for-mongo");

var Auth0Strategy = require("passport-auth0");
var passport = require("passport");

var strategy = new Auth0Strategy({
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL: "/callback"
	},
	function(accessToken, refreshToken, extraParams, profile, done) {
		// accessToken is the token to call Auth0 API (not needed in the most cases)
		// extraParams.id_token has the JSON Web Token
		// profile has all the information from the user
		return done(null, profile);
	}
);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(strategy);

var app = express();
app.use(cors());

app.use(express.session({
	secret: "poots"
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(__dirname + '/public'));

connectToMongo();

function connectToMongo() {
	console.log("Attempting to connect to Mongo");

	MongoClient.connect("mongodb://localhost:27017/venturerealm", function(err, db) {
		if (err) {
			setTimeout(function() {
				connectToMongo();
			}, 1000);

			return;
		}

		console.log("Connected to server");

		app.listen(8000, function() {
			console.log("Listening on :8000");
		});

		app.get("/callback",
			passport.authenticate("auth0", {
				failureRedirect: "/login"
			}),
			function(req, res) {
				if (!req.user) {
					throw new Error("User null");
				}
				res.redirect("/");
			}
		);

		app.get("/login",
			passport.authenticate("auth0", {}),
			function(req, res) {
				res.redirect("/");
			});

		// db.close();
	});
}

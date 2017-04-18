var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var dotenv = require("dotenv");
var passport = require("passport");
var Auth0Strategy = require("passport-auth0");
var ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn();
var cors = require("cors");

dotenv.load();

var routes = require("./routes/index");

// This will configure Passport to use Auth0
var strategy = new Auth0Strategy({
	domain: process.env.AUTH0_DOMAIN,
	clientID: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	callbackURL: process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback"
}, function(accessToken, refreshToken, extraParams, profile, done) {
	// accessToken is the token to call Auth0 API (not needed in the most cases)
	// extraParams.id_token has the JSON Web Token
	// profile has all the information from the user
	return done(null, profile);
});

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(session({
	secret: "poots",
	resave: true,
	saveUninitialized: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

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

		app.use("/", routes);

		app.get("/user", ensureLoggedIn, function(req, res) {
			var collection = db.collection("users");

			collection.insert({
				name: req.user.displayName,
				map: [],
				player: {}
			}, function(err, docs) {
				if (err) {
					res.send(err);
				}

				collection.findOne({
					"name": req.user.displayName
				}, function(err, result) {
					if (err) {
						res.send(err);
					}

					res.send(result);
				});
			});
		});

		app.put("/user", ensureLoggedIn, function(req, res) {
			var collection = db.collection("users");

			console.log(req.body);

			collection.update({
				name: req.user.displayName
			}, {
				$set: {
					map: req.body.payload
				}
			});

			collection.findOne({
				"name": req.user.displayName
			}, function(err, result) {
				if (err) {
					res.send(err);
				}

				res.send(result);
			});
		});

		app.use("/game", ensureLoggedIn);
		app.use("/game", express.static("public"));

		// catch 404 and forward to error handler
		app.use(function(req, res, next) {
			var err = new Error("Not Found");
			err.status = 404;
			next(err);
		});

		// error handlers

		// development error handler
		// will print stacktrace
		if (app.get("env") === "development") {
			app.use(function(err, req, res, next) {
				res.status(err.status || 500);
				res.render("error", {
					message: err.message,
					error: err
				});
			});
		}

		// production error handler
		// no stacktraces leaked to user
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render("error", {
				message: err.message,
				error: {}
			});
		});
	});
}

module.exports = app;

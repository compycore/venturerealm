var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var cors = require("cors");
var process = require("process");
var waitForMongo = require("wait-for-mongo");
var router = express.Router();

var Auth0Strategy = require("passport-auth0");
var passport = require("passport");

console.log(process.env.AUTH0_DOMAIN);

var strategy = new Auth0Strategy({
	domain: process.env.AUTH0_DOMAIN,
	clientID: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:8000/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
	// accessToken is the token to call Auth0 API (not needed in the most cases)
	// extraParams.id_token has the JSON Web Token
	// profile has all the information from the user
	return done(null, profile);
});

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(strategy);

var app = express();
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

		app.listen(8000, function() {
			console.log("Listening on :8000");
		});

		// Serve static files
		app.use(ensureLoggedIn, express.static(__dirname + '/public'));

		var router = express.Router();

		/*
// Get the user profile
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('user', { user: req.user });
});
*/

		// Render the login template
		router.get('/login',
			function(req, res) {
				res.render('login', {
					env: process.env
				});
			});

		// Perform session logout and redirect to homepage
		router.get('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
		});

		// Perform the final stage of authentication and redirect to '/user'
		router.get('/callback',
			passport.authenticate('auth0', {
				failureRedirect: '/url-if-something-fails'
			}),
			function(req, res) {
				res.redirect(req.session.returnTo || '/user');
			});

		// db.close();
	});
}

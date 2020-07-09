var express = require("express");
var passport = require("passport");
var router = express.Router();

var env = {
	AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
	AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || "jessemillar.auth0.com",
	AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || "http://localhost:8080/callback"
};

router.get("/", function(req, res, next) {
	res.render("index", {
		title: "VentureRealm",
		env: env
	});
});

router.get("/login",
	function(req, res) {
		res.render("login", {
			env: env
		});
	}
);

router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

router.get("/callback",
	passport.authenticate("auth0", {
		failureRedirect: "/error"
	}),
	function(req, res) {
		res.redirect(req.session.returnTo || "/game");
	}
);

module.exports = router;

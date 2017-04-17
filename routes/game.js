var express = require("express");
var passport = require("passport");
var ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn();
var router = express.Router();

router.get("/game", ensureLoggedIn, function(req, res, next) {
	res.render("game", {
		user: req.user
	});
});

module.exports = router;
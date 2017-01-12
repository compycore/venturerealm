var prompt = require("cli-prompt")

var world = {};
var player = {
	level: 1,
	inventory: [],
	status_effect: null,
};

user_input();
console.log("Hello");

function user_input() {
	prompt("> ", function(val) {
		console.log(val)
	});
}

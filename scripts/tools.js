function probability(percent) {
	if (Math.random() * 100 < percent) {
		return true
	}

	return false
}

// Prepend a message to the text area
function log(message) {
	document.getElementById("game_output").value = message + "\n\n" + document.getElementById("game_output").value;
}

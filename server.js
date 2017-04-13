var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

app.listen(8000, function() {
	console.log('Listening on 8000');
})

// Serve static files
app.use(express.static('public'));

app.post('/users', function(req, res) {
	console.log('Hellooooooooooooooooo!');
})

var express = require('express'),
	mongoose = require('mongoose'),
	Topic = require('./models/topic');
	
// =========================
// CREATE EXPRESS APP
// =========================
var app = express();

// =========================
// MONGOOSE CONNECTION
// =========================
mongoose.connect(process.env.DATABASE_URL);

// =========================
// SETUP EXPRESS APP
// =========================
app.set('view engine', 'ejs');
app.use('/assets', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('landing');
});

app.get('/topics', function(req, res) {
	Topic.find({}, function(err, topics) {
		if (err) {
			res.redirect('/');
		} else {
			res.render('topics/index', {topics: topics});
		}
	});
});

app.get('*', function(req, res) {
	res.send('404 Not Found...Try Looking Somewhere Else!');
});

// =========================
// START SERVER
// =========================
app.listen(process.env.PORT, process.env.IP, function() {
	console.log('The CodeSurf Server Has Started!');
});
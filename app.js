var express = require('express'),
	app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('landing');
});

app.get('/topics', function(req, res) {
	res.render('topics');
});

app.get('*', function(req, res) {
	res.send('404 Not Found...Try Looking Somewhere Else!');
});

app.listen(process.env.PORT, process.env.IP, function() {
	console.log('The CodeSurf Server Has Started!');
});
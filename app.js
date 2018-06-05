var express = require('express'),
	mongoose = require('mongoose'),
	Topic = require('./models/topic');
	
// =========================
// ROUTES
// =========================
var indexRoutes = require('./routes/index'),
	topicRoutes = require('./routes/topics');
	
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

// =========================
// MOMENTJS CONFIG
// =========================
app.locals.moment = require('moment');

// =========================
// SETUP EXPRESS ROUTES
// =========================
app.use('/', indexRoutes);
app.use('/topics', topicRoutes);

// Catch all route displays 404 page
app.get('*', function(req, res) {
	res.send('404 Not Found...Try Looking Somewhere Else!');
});

// =========================
// START SERVER
// =========================
app.listen(process.env.PORT, process.env.IP, function() {
	console.log('The CodeSurf Server Has Started!');
});
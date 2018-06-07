var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	User = require('./models/user');;
	
// =========================
// ROUTES
// =========================
var indexRoutes = require('./routes/index'),
	topicRoutes = require('./routes/topics'),
	resourceRoutes = require('./routes/resources'),
	commentRoutes = require('./routes/comments');
	
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
app.use(bodyParser.urlencoded({extended: true}));

// =========================
// MOMENTJS CONFIG
// =========================
app.locals.moment = require('moment');

// =========================
// PASSPORT CONFIG
// =========================
app.use(require('express-session')({
	secret: process.env.EXPRESS_SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use middleware to setup user info
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

// =========================
// SETUP EXPRESS ROUTES
// =========================
app.use('/', indexRoutes);
app.use('/topics', topicRoutes);
app.use('/topics/:topic_id/resources', resourceRoutes);
app.use('/topics/:topic_id/resources/:resource_id/comments', commentRoutes);

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
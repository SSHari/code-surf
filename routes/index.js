var express = require('express'),
	passport = require('passport'),
	User = require('../models/user'),
	middleware = require('../middleware'),
	router = express.Router();

// =========================
// LANDING PAGE ROUTE
// =========================
router.get('/', function(req, res) {
	res.render('landing');
});

// =========================
// AUTH ROUTES
// =========================
// get sign up page
router.get('/register', middleware.isLoggedOut, function(req, res) {
	res.render('register');
});

// sign up a new user
router.post('/register', middleware.isLoggedOut, function(req, res) {
	var newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username
	});
	
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			passport.authenticate('local')(req, res, function() {
				req.flash('success', 'Welcome to CodeSurf ' + user.username);
				res.redirect('/topics');
			});
		}
	});
});

// get login page
router.get('/login', middleware.isLoggedOut, function(req, res) {
	res.render('login', {page: 'login'});
});

// log user in
router.post('/login', middleware.isLoggedOut, passport.authenticate('local', {
	successRedirect: '/topics',
	failureRedirect: '/login',
	successFlash: 'Welcome!',
	failureFlash: 'There was an issue with the credentials provided'
}), function(req, res) {
});

// log user out
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Logged you out!');
	res.redirect('/');
});

module.exports = router;
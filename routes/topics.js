var express = require('express'),
	Topic = require('../models/topic'),
	middleware = require('../middleware'),
	router = express.Router();

// =========================
// RESTful TOPICS ROUTES
// =========================
// INDEX ROUTE
router.get('/', function(req, res) {
	Topic.find({}, function(err, topics) {
		if (err || !topics) {
			res.redirect('/');
		} else {
			res.render('topics/index', {topics: topics});
		}
	});
});

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('topics/new');
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res) {
	// add author to topic before creation
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	req.body.topic.author = author;
	
	Topic.create(req.body.topic, function(err, topic) {
		if (err) {
			res.redirect('/topics');
		} else {
			res.redirect('/topics');
		}
	});
});

// SHOW ROUTE
router.get('/:topic_id', function(req, res) {
	Topic.findById(req.params.topic_id).populate('resources').exec(function(err, topic) {
		if (err || !topic) {
			res.redirect('/topics');
		} else {
			res.render('topics/show', {topic: topic});
		}
	});
});

module.exports = router;
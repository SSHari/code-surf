var express = require('express'),
	Topic = require('../models/topic'),
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
router.get('/new', function(req, res) {
	res.render('topics/new');
});

// CREATE ROUTE
router.post('/', function(req, res) {
	Topic.create(req.body.topic, function(err, topic) {
		if (err) {
			res.redirect('/topics');
		} else {
			res.redirect('/topics');
		}
	});
});

module.exports = router;
var express = require('express'),
	Topic = require('../models/topic'),
	router = express.Router();

// =========================
// RESTful TOPICS ROUTES
// =========================
// INDEX ROUTE
router.get('/', function(req, res) {
	Topic.find({}, function(err, topics) {
		if (err) {
			res.redirect('/');
		} else {
			res.render('topics/index', {topics: topics});
		}
	});
});

router.get('/new', function(req, res) {
	res.render('topics/new');
});

module.exports = router;
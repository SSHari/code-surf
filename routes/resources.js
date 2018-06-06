var express = require('express'),
	Topic = require('../models/topic'),
	Resource = require('../models/resource'),
	router = express.Router({mergeParams: true});
	
// =========================
// RESTful RESOURCES ROUTES
// =========================
// NEW ROUTE
router.get('/new', function(req, res) {
	Topic.findById(req.params.topic_id, function(err, topic) {
		if (err || !topic) {
			res.redirect('/topics');
		} else {
			res.render('resources/new', {topic: topic});
		}
	});
});

// CREATE ROUTE
router.post('/', function(req, res) {
	Topic.findById(req.params.topic_id, function(err, topic) {
		if (err || !topic) {
			res.redirect('/topics');
		} else {
			Resource.create(req.body.resource, function(err, resource) {
				if (err) {
					res.redirect('/topics/' + req.params.topic_id);
				} else {
					// add resource to topic
					topic.resources.push(resource);
					
					// save topic
					topic.save();
					
					// redirect to topics page
					res.redirect('/topics/' + req.params.topic_id);
				}
			});
		}
	});
});

// SHOW ROUTE
router.get('/:resource_id', function(req, res) {
	res.send('Resource Show Route!');
});

module.exports = router;
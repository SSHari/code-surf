var express = require('express'),
	utils = require('../utils'),
	Topic = require('../models/topic'),
	Resource = require('../models/resource'),
	middleware = require('../middleware'),
	router = express.Router({mergeParams: true}),
	sanitizerMethods = utils.sanitizerMethods;
	
// =========================
// RESTful RESOURCES ROUTES
// =========================
// NEW ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res) {
	Topic.findById(req.params.topic_id, function(err, topic) {
		if (err || !topic) {
			res.redirect('/topics');
		} else {
			res.render('resources/new', {topic: topic});
		}
	});
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res) {
	Topic.findById(req.params.topic_id, function(err, topic) {
		var anchor;
		
		if (err || !topic) {
			res.redirect('/topics');
		} else {
			anchor = '<a class="btn btn-primary" href="' + req.body.resource.resourceLink + '">View Resource</a>';
			req.body.resource.resourceLink = sanitizerMethods.sanitizeAnchorTag(anchor);
			
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
	Resource.findById(req.params.resource_id, function(err, resource) {
		if (err || !resource) {
			res.redirect('/topics/' + req.params.topic_id);
		} else {
			resource.resourceLink = sanitizerMethods.sanitizeAnchorTag(resource.resourceLink);
			res.render('resources/show', {resource: resource});
		}
	});
});

module.exports = router;
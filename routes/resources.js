var express = require('express'),
	utils = require('../utils'),
	Topic = require('../models/topic'),
	Resource = require('../models/resource'),
	indexMiddleware = require('../middleware/index'),
	topicMiddleware = require('../middleware/topic'),
	resourceMiddleware = require('../middleware/resource'),
	router = express.Router({mergeParams: true}),
	sanitizerMethods = utils.sanitizerMethods;
	
// =========================
// RESTful RESOURCES ROUTES
// =========================
// NEW ROUTE
router.get('/new', indexMiddleware.isLoggedIn, topicMiddleware.findTopicById, function(req, res) {
	if (!req.topic) {
		res.redirect('/topics');
	} else {
		res.render('resources/new', {topic: req.topic});
	}
});

// CREATE ROUTE
router.post('/', indexMiddleware.isLoggedIn, topicMiddleware.findTopicById, function(req, res) {
	var author, anchor;
	if (!req.topic) {
		res.redirect('/topics');
	} else {
		// add author to resource before creation
		author = {
			id: req.user._id,
			username: req.user.username
		};
		req.body.resource.author = author;
		
		// add topic to resource before creation
		req.body.resource.topic = {
			id: req.topic._id,
			topicTitle: req.topic.title
		};
		
		// create anchor tag for resource before creation
		anchor = '<a class="btn btn-primary" href="' + req.body.resource.resourceLink + '">View Resource</a>';
		req.body.resource.resourceLink = sanitizerMethods.sanitizeAnchorTag(anchor);
		
		Resource.create(req.body.resource, function(err, resource) {
			if (err) {
				res.redirect('/topics/' + req.params.topic_id);
			} else {
				// add resource to topic
				req.topic.resources.push(resource);
				
				// save topic
				req.topic.save();
				
				// redirect to topics page
				res.redirect('/topics/' + req.params.topic_id);
			}
		});
	}
});

// SHOW ROUTE
router.get('/:resource_id', resourceMiddleware.findResourceByIdAndPopulateComments, function(req, res) {
	if (!req.resource) {
		res.redirect('/topics/' + req.params.topic_id);
	} else {
		req.resource.resourceLink = sanitizerMethods.sanitizeAnchorTag(req.resource.resourceLink);
		res.render('resources/show', {topic_id: req.params.topic_id, resource: req.resource});
	}
});

module.exports = router;
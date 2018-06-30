var express = require('express'),
	utils = require('../utils'),
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
		req.flash('error', 'The topic you were trying to add a resource to could not be retrieved.');
		res.redirect('/topics');
	} else {
		res.render('resources/new', {topic: req.topic});
	}
});

// CREATE ROUTE
router.post('/', resourceMiddleware.cleanUserCreatedResource, indexMiddleware.isLoggedIn, topicMiddleware.findTopicById, function(req, res) {
	var author, anchor;
	if (!req.topic) {
		req.flash('error', 'The topic you were trying to add a resource to could not be retrieved.');
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
				req.flash('error', 'A new resource cannot be added at this time. Try again later.');
				res.redirect('/topics/' + req.params.topic_id);
			} else {
				// add resource to topic
				req.topic.resources.push(resource);
				
				// save topic
				req.topic.save();
				
				// add flash message
				req.flash('success', 'Your resource was successfully created!');
				
				// redirect to topics page
				res.redirect('/topics/' + req.params.topic_id);
			}
		});
	}
});

// SHOW ROUTE
router.get('/:resource_id', resourceMiddleware.findResourceByIdAndPopulateComments, function(req, res) {
	if (!req.resource) {
		req.flash('error', 'The resource could not be found.');
		res.redirect('/topics/' + req.params.topic_id);
	} else {
		req.resource.resourceLink = sanitizerMethods.sanitizeAnchorTag(req.resource.resourceLink);
		res.render('resources/show', {topic_id: req.params.topic_id, resource: req.resource});
	}
});

// EDIT ROUTE
router.get('/:resource_id/edit', topicMiddleware.findTopicById, resourceMiddleware.findResourceById, resourceMiddleware.checkResourceOwnership, function(req, res) {
	if (!req.resource) {
		req.flash('error', 'The resource cannot be edited at this time. Try again later.');
		res.redirect('back');
	} else {
		req.resource.resourceLink = req.resource.resourceLink.match(/href="([^"]*)/);
		req.resource.resourceLink = req.resource.resourceLink ? req.resource.resourceLink[1] : '';
		res.render('resources/edit', {topic: req.topic, resource: req.resource});
	}
});

// UPDATE ROUTE
router.put('/:resource_id', resourceMiddleware.cleanUserCreatedResource, resourceMiddleware.findResourceById, resourceMiddleware.checkResourceOwnership, function(req, res) {
	var anchor;
	if (!req.resource) {
		req.flash('error', 'The resource cannot be edited at this time. Try again later.');
		res.redirect('back');
	} else {
		// create anchor tag for resource before update
		anchor = '<a class="btn btn-primary" href="' + req.body.resource.resourceLink + '">View Resource</a>';
		req.body.resource.resourceLink = sanitizerMethods.sanitizeAnchorTag(anchor);
		req.resource.set(req.body.resource);
		req.resource.save(function(err, resource) {
			if (err || !resource) {
				req.flash('error', 'The resource cannot be edited at this time. Try again later.');
				res.redirect('back');
			} else {
				req.flash('success', 'Your resource was successfully updated!');
				res.redirect('/topics/' + req.params.topic_id + '/resources/' + req.params.resource_id);
			}
		});
	}
});

// DESTROY ROUTE
router.delete('/:resource_id', resourceMiddleware.findResourceById, resourceMiddleware.checkResourceOwnership, function(req, res) {
	if (!req.resource) {
		req.flash('error', 'The resource cannot be deleted at this time. Try again later.');
		res.redirect('back');
	} else {
		req.resource.remove(function(err) {
			if (err) {
				req.flash('error', 'The resource cannot be deleted at this time. Try again later.');
				res.redirect('back');
			} else {
				req.flash('success', 'Your resource was successfully deleted!');
				res.redirect('/topics/' + req.params.topic_id);
			}
		});
	}
});

module.exports = router;
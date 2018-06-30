var express = require('express'),
	Topic = require('../models/topic'),
	utils = require('../utils'),
	indexMiddleware = require('../middleware/index'),
	topicMiddleware = require('../middleware/topic'),
	router = express.Router();

// =========================
// RESTful TOPICS ROUTES
// =========================
// INDEX ROUTE
router.get('/', topicMiddleware.getLatestResources, function(req, res) {
	var queryObj = {};
	if (req.query.search) {
		queryObj.title = new RegExp(utils.regexMethods.escape(req.query.search), 'gi');
		Topic.find(queryObj, function(err, topics) {
			if (err || !topics || topics.length === 0) {
				req.flash('error', 'No topics were found with the provided search criteria.');
				res.redirect('back');
			} else {
				res.render('topics/index', {topics: topics, latestResources: req.latestResources});
			}
		});
	} else {
		Topic.find(queryObj, function(err, topics) {
			if (err || !topics) {
				req.flash('error', 'There was an issue retrieving the topics. Try again later.');
				res.redirect('/');
			} else {
				res.render('topics/index', {topics: topics, latestResources: req.latestResources});
			}
		});
	}
});

// NEW ROUTE
router.get('/new', indexMiddleware.isLoggedIn, function(req, res) {
	res.render('topics/new');
});

// CREATE ROUTE
router.post('/', topicMiddleware.cleanUserCreatedTopic, indexMiddleware.isLoggedIn, function(req, res) {
	// add author to topic before creation
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	req.body.topic.author = author;
	
	Topic.create(req.body.topic, function(err, topic) {
		if (err) {
			req.flash('error', 'A new topic cannot be created at this time. Try again later.');
			res.redirect('/topics');
		} else {
			req.flash('success', 'Your topic was created successfully!');
			res.redirect('/topics');
		}
	});
});

// SHOW ROUTE
router.get('/:topic_id', topicMiddleware.findTopicByIdAndPopulateResources, function(req, res) {
	if (!req.topic) {
		req.flash('error', 'The topic cannot be retrieved at this time. Try again later.');
		res.redirect('/topics');
	} else {
		res.render('topics/show', {topic: req.topic});
	}
});

// EDIT ROUTE
router.get('/:topic_id/edit', topicMiddleware.findTopicById, topicMiddleware.checkTopicOwnership, function(req, res) {
	if (!req.topic) {
		req.flash('error', 'The topic cannot be edited at this time. Try again later.');
		res.redirect('/topics/' + req.params.topic_id);
	} else {
		res.render('topics/edit', {topic: req.topic});
	}
});

// UPDATE ROUTE
router.put('/:topic_id', topicMiddleware.cleanUserCreatedTopic, topicMiddleware.findTopicById, topicMiddleware.checkTopicOwnership, function(req, res) {
	if (!req.topic) {
		req.flash('error', 'The topic cannot be edited at this time. Try again later.');
		res.redirect('/topics/' + req.params.topic_id);
	} else {
		req.topic.set(req.body.topic);
		req.topic.save(function(err, topic) {
			if (err || !topic) {
				req.flash('error', 'The topic cannot be edited at this time. Try again later.');
				res.redirect('/topics/' + req.params.topic_id);
			} else {
				req.flash('success', 'Your topic was successfully updated!');
				res.redirect('/topics/' + req.params.topic_id);
			}
		});
	}
});

// DESTROY ROUTE
router.delete('/:topic_id', topicMiddleware.findTopicById, topicMiddleware.checkTopicOwnership, function(req, res) {
	if (!req.topic) {
		req.flash('error', 'The topic cannot be deleted at this time. Try again later.');
		res.redirect('back');
	} else {
		req.topic.remove(function(err) {
			if (err) {
				req.flash('error', 'The topic cannot be deleted at this time. Try again later.');
				res.redirect('back');
			} else {
				req.flash('success', 'Your topic was successfully deleted!');
				res.redirect('/topics');
			}
		});
	}
});

module.exports = router;
var Topic = require('../models/topic'),
	Resource = require('../models/resource');
	
module.exports = {
	findTopicById: function(req, res, next) {
		Topic.findById(req.params.topic_id, function(err, topic) {
			if (err || !topic) {
				req.flash('error', 'Sorry! This topic is causing some internal issues.');
				res.redirect('/topics');
			} else {
				req.topic = topic;
				next();
			}
		});
	},
	
	findTopicByIdAndPopulateResources: function(req, res, next) {
		Topic.findById(req.params.topic_id).populate('resources').exec(function(err, topic) {
			if (err || !topic) {
				req.flash('error', 'Sorry! This topic is causing some internal issues.');
				res.redirect('/topics');
			} else {
				req.topic = topic;
				next();
			}
		});
	},
	
	checkTopicOwnership: function(req, res, next) {
		if (req.isAuthenticated() && req.topic && req.topic.author.id.equals(req.user._id)) {
			next();
		} else {
			req.flash('error', 'Sorry! You cannot mess with a topic that is not yours...');
			res.redirect('back');
		}
	},
	
	getLatestResources: function(req, res, next) {
		Resource.find({}).limit(3).sort({createdAt: -1}).exec(function(err, resources) {
			if (err || !resources) {
				req.latestResources = [];
			} else {
				req.latestResources = resources;
			}
			next();
		});
	},
	
	// prevent the user from filling out topic
	// form data that they shouldn't be able to
	cleanUserCreatedTopic: function(req, res, next) {
		if (req.body.topic) {
			req.body.topic = {
				title: req.body.topic.title,
				description: req.body.topic.description
			};
		}
		next();
	}
};
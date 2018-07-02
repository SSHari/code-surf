var Resource = require('../models/resource'),
	Comment = require('../models/comment');

module.exports = {
	findResourceById: function(req, res, next) {
		Resource.findById(req.params.resource_id, function(err, resource) {
			if (err || !resource) {
				req.flash('error', 'Sorry! This resource is causing some internal issues.');
				res.redirect('/topics/' + req.params.topic_id);
			} else {
				req.resource = resource;
				next();
			}
		});
	},
	
	findResourceByIdAndPopulateComments: function(req, res, next) {
		Resource.findById(req.params.resource_id).populate('comments').exec(function(err, resource) {
			if (err || !resource) {
				req.flash('error', 'Sorry! This resource is causing some internal issues.');
				res.redirect('/topics/' + req.params.topic_id);
			} else {
				req.resource = resource;
				next();
			}
		});
	},
	
	checkResourceOwnership: function(req, res, next) {
		if (req.isAuthenticated() && req.resource && req.resource.author.id.equals(req.user._id)) {
			next();
		} else {
			req.flash('error', 'Sorry! You cannot mess with a resource that is not yours...');
			res.redirect('back');
		}
	},
	
	// prevent the user from filling out resource
	// form data that they shouldn't be able to
	cleanUserCreatedResource: function(req, res, next) {
		if (req.body.resource) {
			req.body.resource = {
				title: req.body.resource.title,
				description: req.body.resource.description,
				resourceLink: req.body.resource.resourceLink
			};
		}
		next();
	},
	
	// removes comments associated with the
	// resources of a topic when the topic is deleted
	removeCommentsByTopicId(req, res, next) {
		if (!req.topic) {
			req.flash('error', 'Sorry! We cannot delete this topic at this time. Try again later.');
			res.redirect('back');
		} else {
			Comment.deleteMany({'resource.id': {$in: req.topic.resources}}, function(err) {
				if (err) {
					req.flash('error', 'Sorry! We cannot delete this topic at this time. Try again later.');
					res.redirect('back');
				} else {
					next();
				}
			});
		}
	},
	
	// removes resources associated with
	// a topic when the topic is deleted
	removeResourcesByTopicId(req, res, next) {
		if (!req.topic) {
			req.flash('error', 'Sorry! We cannot delete this topic at this time. Try again later.');
			res.redirect('back');
		} else {
			Resource.deleteMany({'_id': {$in: req.topic.resources}}, function(err) {
				if (err) {
					req.flash('error', 'Sorry! We cannot delete this topic at this time. Try again later.');
					res.redirect('back');
				} else {
					next();
				}
			});
		}
	}
};
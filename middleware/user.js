var Topic = require('../models/topic'),
	Resource = require('../models/resource'),
	Comment = require('../models/comment'),
	User = require('../models/user');

module.exports = {
	findUserById: function(req, res, next) {
		User.findById(req.params.user_id, function(err, user) {
			if (err || !user) {
				req.flash('error', 'Sorry! This user is causing some internal issues.');
				res.redirect('/topics');
			} else {
				req.user = user;
				next();
			}
		});
	},
	
	findUserAdditionalInfo: function(req, res, next) {
		Promise.all([
			Topic.find({'author.id': req.user._id}),
			Resource.find({'author.id': req.user._id}),
			Comment.find({'author.id': req.user._id}).populate('resource.id').exec()
		]).then(function(results) {
			req.topics = results[0];
			req.resources = results[1];
			req.comments = results[2];
			next();
		}).catch(function(err) {
			req.topics = [];
			req.resources = [];
			req.comments = [];
			next();
		});
	}
};
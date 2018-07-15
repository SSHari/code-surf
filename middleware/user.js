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
				req.foundUser = user;
				next();
			}
		});
	},
	
	checkForMatchingUser: function(req, res, next) {
		if (req.isAuthenticated() && req.user && req.foundUser._id.equals(req.user._id)) {
			next();
		} else {
			req.flash('error', 'Sorry! You cannot update this account.');
			res.redirect('back');
		}
	},
	
	findUserAdditionalInfo: function(req, res, next) {
		if (req.foundUser) {
			Promise.all([
				Topic.find({'author.id': req.foundUser._id}),
				Resource.find({'author.id': req.foundUser._id}),
				Comment.find({'author.id': req.foundUser._id}).populate('resource.id').exec()
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
		} else {
			req.topics = [];
			req.resources = [];
			req.comments = [];
			next();
		}
	}
};
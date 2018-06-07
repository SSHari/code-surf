var Resource = require('../models/resource');

module.exports = {
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/login');
		}
	},
	
	isLoggedOut: function(req, res, next) {
		if (!req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/topics');
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
	}
};
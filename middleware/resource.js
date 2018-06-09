var Resource = require('../models/resource');

module.exports = {
	findResourceById: function(req, res, next) {
		Resource.findById(req.params.resource_id, function(err, resource) {
			if (err || !resource) {
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
				res.redirect('/topics/' + req.params.topic_id);
			} else {
				req.resource = resource;
				next();
			}
		});
	}
};
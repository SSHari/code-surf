var express = require('express'),
	Resource = require('../models/resource'),
	Comment = require('../models/comment'),
	router = express.Router();

// =========================
// RESTful COMMENTS ROUTES
// =========================
// CREATE ROUTE
router.post('/', function(req, res) {
	Resource.findById(req.params.resource_id, function(err, resource) {
		var author;
		if (err || !resource) {
			res.redirect('/topics/' + req.params.topic_id);
		} else {
			// add author to comment before creation
			author = {
				id: req.user._id,
				username: req.user.username
			};
			req.body.comment.author = author;
			
			// add resource to comment before creation
			req.body.comment.resource = {
				id: resource._id,
				resourceTitle: resource.title
			};
			
			Comment.create(req.body.comment, function(err, comment) {
				if (err || !comment) {
					res.redirect('/topics/' + req.params.topic_id + '/resources/' + resource._id);
				} else {
					// add comment to resource
					resource.comments.push(comment);
					
					// save resource
					resource.save();
					
					// redirect to resource page
					res.redirect('/topics/' + req.params.topic_id + '/resources/' + resource._id)
				}
			});
		}
	});
});

module.exports = router;
var express = require('express'),
	Comment = require('../models/comment'),
	indexMiddleware = require('../middleware/index'),
	resourceMiddleware = require('../middleware/resource'),
	commentMiddleware = require('../middleware/comment'),
	router = express.Router({mergeParams: true});

// =========================
// RESTful COMMENTS ROUTES
// =========================
// CREATE ROUTE
router.post('/', commentMiddleware.cleanUserCreatedComment, indexMiddleware.isLoggedIn, resourceMiddleware.findResourceById, function(req, res) {
	var author;
	if (!req.resource) {
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
			id: req.resource._id,
			resourceTitle: req.resource.title
		};
		
		Comment.create(req.body.comment, function(err, comment) {
			if (err || !comment) {
				res.redirect('/topics/' + req.params.topic_id + '/resources/' + req.resource._id);
			} else {
				// add comment to resource
				req.resource.comments.push(comment);
				
				// save resource
				req.resource.save();
				
				// redirect to resource page
				res.redirect('/topics/' + req.params.topic_id + '/resources/' + req.resource._id)
			}
		});
	}
});

// UPDATE ROUTE
router.put('/:comment_id', commentMiddleware.cleanUserCreatedComment, commentMiddleware.findCommentById, commentMiddleware.checkCommentOwnership, function(req, res) {
	if (!req.comment) {
		res.redirect('back');
	} else {
		req.comment.set(req.body.comment);
		req.comment.save(function(err, comment) {
			if (err || !comment) {
				res.redirect('back');
			} else {
				res.redirect('back');
			}
		});
	}
});

// DESTROY ROUTE
router.delete('/:comment_id', commentMiddleware.findCommentById, commentMiddleware.checkCommentOwnership, function(req, res) {
	if (!req.comment) {
		res.redirect('back');
	} else {
		req.comment.remove(function(err) {
			if (err) {
				res.redirect('back');
			} else {
				res.redirect('back');
			}
		});
	}
});

module.exports = router;
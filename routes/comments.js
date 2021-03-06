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
		req.flash('error', 'The resource you were commenting on could not be retrieved.');
		res.redirect('/topics/' + req.params.topic_id);
	} else {
		// add author to comment before creation
		author = {
			id: req.user._id,
			username: req.user.username,
			profilePicture: req.user.profilePicture
		};
		req.body.comment.author = author;
		
		// add resource to comment before creation
		req.body.comment.resource = {
			id: req.resource._id,
			resourceTitle: req.resource.title
		};
		
		Comment.create(req.body.comment, function(err, comment) {
			if (err || !comment) {
				req.flash('error', 'A comment can not be posted at this time. Try again later.');
				res.redirect('/topics/' + req.params.topic_id + '/resources/' + req.resource._id);
			} else {
				// add comment to resource
				req.resource.comments.push(comment);
				
				// save resource
				req.resource.save();
				
				// add flash message
				req.flash('success', 'Your comment was successfully created!');
				
				// redirect to resource page
				res.redirect('/topics/' + req.params.topic_id + '/resources/' + req.resource._id)
			}
		});
	}
});

// UPDATE ROUTE
router.put('/:comment_id', commentMiddleware.cleanUserCreatedComment, commentMiddleware.findCommentById, commentMiddleware.checkCommentOwnership, function(req, res) {
	if (!req.comment) {
		req.flash('error', 'Your comment could not be updated at this time. Try again later.');
		res.redirect('back');
	} else {
		// set comment edited to true
		req.body.comment.edited = true;
		
		// update comment
		req.comment.set(req.body.comment);
		req.comment.save(function(err, comment) {
			if (err || !comment) {
				req.flash('error', 'Your comment could not be updated at this time. Try again later.');
				res.redirect('back');
			} else {
				req.flash('success', 'Your comment was updated successfully!');
				res.redirect('back');
			}
		});
	}
});

// DESTROY ROUTE
router.delete('/:comment_id', commentMiddleware.findCommentById, commentMiddleware.checkCommentOwnership, resourceMiddleware.findResourceById, function(req, res) {
	var comments, commentToRemoveIndex, i;
	if (!req.comment || !req.resource) {
		req.flash('error', 'Your comment could not be deleted at this time. Try again later.');
		res.redirect('back');
	} else {
		// get index of comment to remove
		comments = req.resource.comments;
		for (i = 0; i < comments.length; i += 1) {
			if (comments[i].equals(req.comment._id)) {
				commentToRemoveIndex = i;
				break;
			}
		}

		if (commentToRemoveIndex !== undefined) {
			// remove comment id from resource
			req.resource.comments = comments.slice(0, commentToRemoveIndex).concat(comments.slice(commentToRemoveIndex + 1));
			
			// save resource
			req.resource.save();
		}

		// delete comment
		req.comment.remove(function(err) {
			if (err) {
				req.flash('error', 'Your comment could not be deleted at this time. Try again later.');
				res.redirect('back');
			} else {
				req.flash('success', 'Your comment was deleted successfully!');
				res.redirect('back');
			}
		});
	}
});

module.exports = router;
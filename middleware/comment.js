var Comment = require('../models/comment');

module.exports = {
	findCommentById: function(req, res, next) {
		Comment.findById(req.params.comment_id, function(err, comment) {
			if (err || !comment) {
				res.redirect('back');
			} else {
				req.comment = comment;
				next();
			}
		});
	},
	
	checkCommentOwnership: function(req, res, next) {
		if (req.isAuthenticated() && req.comment && req.comment.author.id.equals(req.user._id)) {
			next();
		} else {
			res.redirect('back');
		}
	},
	
	// prevent the user from filling out comment
	// form data that they shouldn't be able to
	cleanUserCreatedComment: function(req, res, next) {
		if (req.body.comment) {
			req.body.comment = {
				text: req.body.comment.text
			};
		}
		next();
	}
};
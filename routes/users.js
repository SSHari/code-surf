var express = require('express'),
	userMiddleware = require('../middleware/user'),
	router = express.Router();

// =========================
// RESTful USERS ROUTES
// =========================
// SHOW ROUTE
router.get('/:user_id', userMiddleware.findUserById, userMiddleware.findUserAdditionalInfo, function(req, res) {
	if (!req.user) {
		req.flash('error', 'The requested user could not be found.');
		res.redirect('/topics');
	} else {
		res.render('users/show', {user: req.user, topics: req.topics, resources: req.resources, comments: req.comments});
	}
});

module.exports = router;
module.exports = {
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			req.flash('error', 'You need to be logged in to do that!');
			res.redirect('/login');
		}
	},
	
	isLoggedOut: function(req, res, next) {
		if (!req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/topics');
		}
	}
};
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
	}
};
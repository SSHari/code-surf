var express = require('express'),
	router = express.Router();

// =========================
// LANDING PAGE ROUTE
// =========================
router.get('/', function(req, res) {
	res.render('landing');
});

module.exports = router;
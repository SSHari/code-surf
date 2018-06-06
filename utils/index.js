var sanitizeHtml = require('sanitize-html'),
	sanitizerMethods;

// =========================
// CUSTOM SANITIZER METHODS
// =========================
sanitizerMethods = {
	sanitizeAnchorTag: function(anchor) {
		return sanitizeHtml(anchor, {
			allowedTags: ['a'],
			allowedAttributes: {
				'a': ['href', 'class']
			}
		});
	}
};

module.exports = {
	sanitizerMethods: sanitizerMethods
};
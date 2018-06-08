var sanitizeHtml = require('sanitize-html'),
	sanitizerMethods,
	regexMethods;

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

// =========================
// CUSTOM REGEX METHODS
// =========================
regexMethods = {
	escape: function(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	}
};

module.exports = {
	sanitizerMethods: sanitizerMethods,
	regexMethods: regexMethods
};
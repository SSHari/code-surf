var mongoose = require('mongoose'),
	commentSchema;
	
commentSchema = new mongoose.Schema({
	text: String,
	edited: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String,
		profilePicture: String
	},
	resource: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Resource'
		},
		resourceTitle: String
	}
});

module.exports = mongoose.model('Comment', commentSchema);
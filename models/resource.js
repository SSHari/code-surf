var mongoose = require('mongoose'),
	resourceSchema;
	
resourceSchema = new mongoose.Schema({
	title: String,
	description: String,
	resourceLink: String,
	createdAt: {
		type: Date,
		default: Date.now
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	topic: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Topic'
		},
		topicTitle: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

module.exports = mongoose.model('Resource', resourceSchema);
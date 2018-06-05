var mongoose = require('mongoose'),
	topicSchema;
	
topicSchema = new mongoose.Schema({
	title: String,
	description: String,
	author: String,
	createdAt: {
		type: Date,
		default: Date.now
	},
	resourceCount: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Topic', topicSchema);
var mongoose = require('mongoose'),
	topicSchema;
	
topicSchema = new mongoose.Schema({
	title: String,
	description: String,
	createdAt: {
		type: Date,
		default: Date.now
	},
	author: String,
	resources: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Resource'
		}
	]
});

module.exports = mongoose.model('Topic', topicSchema);
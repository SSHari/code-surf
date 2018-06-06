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
	author: String
});

module.exports = mongoose.model('Resource', resourceSchema);
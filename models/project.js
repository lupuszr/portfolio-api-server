var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
	name: String,
	description: String,
	link: String
})

module.exports = mongoose.model('Project', ProjectSchema);
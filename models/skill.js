var mongoose = require('mongoose');

var Item = new mongoose.Schema({
	name: String,
	progress: Number
});

var SkillSchema = new mongoose.Schema({
	sectionName: String,
	description: String,
	items: [Item]
})

module.exports = mongoose.model('Skill', SkillSchema);
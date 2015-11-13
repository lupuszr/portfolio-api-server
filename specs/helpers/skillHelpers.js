var _ = require('lodash');
var Skill = require('models/skill.js')


var createNewSkill = function(skillObj){
	
	return new Skill(skillObj).save(function(err, model){
		if (err) return err;
		return model;
	})
}

var createNewSkills = function(skillObjArray){
	return _.map(skillObjArray, createNewSkill);
}

module.exports = {
	createNewSkill: createNewSkill,
	createNewSkills: createNewSkills
}
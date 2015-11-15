var Skill = require('../models/skill');
var auth = require('./auth')

var show = function(req, res) {
	req.checkParams('skill_id', 'Invalid urlparam').isMongoId();

  	var errors = req.validationErrors();
  	if (errors) {
    	res.status(400).send('There have been validation errors: ' +  util.inspect(errors));
    	return;
  	}

	Skill.findById(req.params.skill_id, function(err, skill) {
		if (err)
			res.send(err);

		res.json(skill);
	})
}

var update = function(req, res) {
	Skill.findById(req.params.skill_id, function(err, skill) {
		if (err){
			res.send(err)
		}
		if (!!skill === false){
			res.send("No such skill")
			return;
		}
		for (var key in req.body) {
			if (req.body.hasOwnProperty(key)) {
  				switch(key){
  					case "sectionName":
  						skill.sectionName = req.body.sectionName;
  						break;
  					case "description":
  						skill.description = req.body.description;
  						break;
  					case "items":
  						skill.items = req.body.items;
  						break;
  					default: break;
  				}
  			}
  		}

  		skill.save(function (err) {
  			if(err)
  				res.send(err);

  			res.json(skill);
  		})
	})
}

var destroy = function(req, res){
	
	Skill.findByIdAndRemove(req.params.skill_id, function(err){
		if(err)
			res.send(err)

		res.json({message: "Skill Removed"})
	})
}

var index = function(req, res) {
	Skill.find(function(err, skills) {
		if (err)
			res.send(err);
		res.json(skills);
	})
}

var create = function(req, res) {
	var skill = new Skill()
	skill.sectionName = req.body.sectionName;
	skill.description = req.body.description;
	skill.items = req.body.items;

	skill.save(function  (err) {
		if (err) 
			res.send(err);

		res.json({ message: 'Skill added', data: skill})
	})	
} 

module.exports.bindRoutes = function(collection, elem){
	collection
		.get(index)
		.post(auth.isAuthenticated, create);

	elem
		.get(show)
		.put(auth.isAuthenticated, update)
		.delete(auth.isAuthenticated, destroy)
}
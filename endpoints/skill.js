var Skill = require('../models/skill');
var auth = require('./auth')

var show = function(req, res) {

	Skill.findById(req.params.skill_id, function(err, skill) {
		if (err)
			res.send(err);

		res.json(skill);
	})
}

var update = function(req, res) {

	Skill.findById(req.params.skill_id, function(err, skill) {
		if (err)
			res.send(err)

		for (var key in req.body) {
			if (req.body.hasOwnProperty(key)) {
  				switch(key){
  					case "name":
  						skill.name = req.body.name;
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

  			res.json(project);
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
	skill.name = req.body.name;
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
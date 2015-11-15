var Project = require('../models/project');
var auth = require('./auth')
var util = require('./util')

var show = function(req, res) {
	req.checkParams('project_id', 'Invalid urlparam').isMongoId();

  	var errors = req.validationErrors();
  	if (errors) {
    	res.status(400).send('There have been validation errors: ' +  util.inspect(errors));
    	return;
  	}


	Project.findById(req.params.project_id, function(err, project) {
		if (err)
			res.send(err);

		res.json(project);
	})
}

var update = function(req, res) {

	Project.findById(req.params.project_id, function(err, project) {
		if (err)
			res.send(err)

		if (!!project === false){
			res.send("No such project")
			return;
		}

		for (var key in req.body) {
			if (req.body.hasOwnProperty(key)) {
  				switch(key){
  					case "name":
  						project.name = req.body.name;
  						break;
  					case "description":
  						project.description = req.body.description;
  						break;
  					case "link":
  						project.link = req.body.link;
  						break;
  					default: break;
  				}
  			}
  		}

  		project.save(function (err) {
  			if(err)
  				res.send(err);

  			res.json(project);
  		})
	})
}

var destroy = function(req, res){
	
	Project.findByIdAndRemove(req.params.project_id, function(err){
		if(err)
			res.send(err)

		res.json({message: "Project Removed"})
	})
}

var index = function(req, res) {
	Project.find(function(err, projects) {
		if (err)
			res.send(err);
		res.json(projects);
	})
}

var create = function(req, res) {
	var project = new Project()
	project.name = req.body.name;
	project.description = req.body.description;
	project.link = req.body.link;
	project.save(function  (err) {
		if (err) 
			res.send(err);

		res.json({ message: 'project added', data: project})
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
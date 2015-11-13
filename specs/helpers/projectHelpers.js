var _ = require('lodash');
var Project = require('models/project.js')


var createNewProject = function(projectObj){
	
	return new Project(projectObj).save(function(err, model){
		if (err) return err;
		return model;
	})
}

var createNewProjects = function(projectObjArray){
	return _.map(projectObjArray, createNewProject);
}

module.exports = {
	createNewProject: createNewProject,
	createNewProjects: createNewProjects
}
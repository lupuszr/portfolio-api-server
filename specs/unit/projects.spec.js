require('rootpath')();
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var db = require('db.js');
var config   = require('config.js')
var Project = require('models/project')
var Helper = require('specs/helpers/projectHelpers.js');
var _ = require('lodash')

describe('Projects', function() {
	var url = 'http://localhost:5000';
	before(function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(db.testUrl,done);
	})

	beforeEach(function(done) {
			Project.remove({}).then(function (argument) {
				done()
			})			
	});

	describe('POST /projects', function() {
		it('should create a new project', function(done) {
			var project = {
				name: "Project Name",
				description: "Project Description",
				link: "www.example.com"
			};
			request(url)
				.post('/api/projects')
				.send(project)
				.auth(config.adminName, config.adminPass)
				.expect(200)
				.end(function(err,res) {
					if (err) return done(err)

					res.body.data.should.have.property('_id');
			        res.body.data.name.should.equal('Project Name');
			        res.body.data.description.should.equal('Project Description');
			        res.body.data.link.should.equal('www.example.com');
			        done();
				});
		});

		it('should not create a new project without auth', function(done) {
			var project = {
				name: "Project Name",
				description: "Project Description",
				link: "www.example.com"
			};
			request(url)
				.post('/api/projects')
				.send(project)
				.expect(401)
				.end(function(err,res) {
					if (err) return done(err)

					res.error.text.should.equal('Unauthorized')
			        res.unauthorized.should.equal(true);
			        done();
				});
		});
	});

	describe('GET /projects', function() {

		it('should get all projects', function(done) {
			
			var projects = [
					{name: "Project 0", description: "0", link: "www.example0.com"},
					{name: "Project 1", description: "1", link: "www.example1.com"},
					]

			storedProjects = Helper.createNewProjects(projects);		
			
			request(url)
				.get('/api/projects')
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);

					_.forEach(res.body, function (elem, index) {
						elem.should.have.property('_id')
						elem.name.should.equal('Project ' + index);
			        	elem.description.should.equal(index.toString());
			        	elem.link.should.equal("www.example" + index + ".com");
					})
				})
			done()
		});
	});

	describe('GET /projects/:id', function() {
		
		it('should get a project', function(done) {
			var id = null; 
			var project = {name: "Project 0", description: "0", link: "www.example.com"};
			var storedProject = Helper.createNewProject(project);
			storedProject.then(function (docs) {
				id = docs._id;
				request(url)
					.get('/api/projects/'+id)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.should.have.property('_id')
						res.body.name.should.equal('Project 0');
			        	res.body.description.should.equal('0');
			        	res.body.link.should.equal("www.example.com");
						done()	
					})
			}, function (err) {
				return done(err);
			}) 

		});
	});

	describe('PUT /projects/:id', function() {
		it('should update a project', function (done) {
			var id = null;
			var updateContent= {
				name: "Updated Project",
				description: "Updated"
			} 
			var project = {name: "Project 0", description: "0", link: "www.example.com"};
			var storedProject = Helper.createNewProject(project);
			storedProject.then(function (docs) {
				id = docs._id;
				request(url)
					.put('/api/projects/'+id)
					.send(updateContent)
					.auth(config.adminName, config.adminPass)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.should.have.property('_id')
						res.body.name.should.equal('Updated Project');
			        	res.body.description.should.equal('Updated');
			        	res.body.link.should.equal("www.example.com")
			        	done()
					})
			}, function (err) {
				return done(err);
			})

			
		})
		

		it('should not update a project without auth', function (done) {
			Project.remove({})
			var id = null;
			var updateContent= {
				name: "Updated Project",
				description: "Updated"
			} 
			var project = {name: "Project 0", description: "0", link: "www.example.com"};
			var storedProject = Helper.createNewProject(project);
			storedProject.then(function (docs) {
				id = docs._id;
				request(url)
					.put('/api/projects/'+id)
					.send(updateContent)
					.expect(401)
					.end(function (err, res) {
						if (err) return done(err)

						res.error.text.should.equal('Unauthorized')
				        res.unauthorized.should.equal(true);
						done()
					})

			}, function (err) {
				return done(err);
			})

		})
	});

	describe('DELETE projects/:project_id', function() {
		it('should delete a project', function(done) {
			var id = null;
			var project = {name: "Project 0", description: "0", link: "www.example.com"};
			var storedProject = Helper.createNewProject(project);
			storedProject.then(function (docs) {
				id = docs._id;
				request(url)
					.delete('/api/projects/'+id)
					.auth(config.adminName, config.adminPass)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.message.should.equal('Project Removed')
						done()
					})
			}, function (err) {
				return done(err);
			})

		});

		it('should not delete a project without auth', function(done) {
			var id = null;
			var project = {name: "Project 0", description: "0", link: "www.example.com"};
			var storedProject = Helper.createNewProject(project);
			storedProject.then(function (docs) {
				id = docs._id;
				request(url)
					.delete('/api/projects/'+id)
					.expect(401)
					.end(function (err, res) {
						if (err) return done(err)

						res.error.text.should.equal('Unauthorized')
			        	res.unauthorized.should.equal(true);
			        	done()
					})
			}, function (err) {
				return done(err);
			})			
		});
	});
});
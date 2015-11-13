require('rootpath')();
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var db = require('db.js');
var config   = require('config.js')
var Skill = require('models/skill.js')
var Helper = require('specs/helpers/skillHelpers.js');
var _ = require('lodash')

describe('Skills', function() {
	var url = 'http://localhost:5000';
	before(function (done) {
		if (mongoose.connection.db) return done();

		mongoose.connect(db.testUrl,done);

	})

	beforeEach(function(done) {
			Skill.remove({}).then(function (argument) {
				done()
			})			
	});

	describe('GET /skills', function() {

		it('should get all skills', function(done) {
			
			var skills = [
					{sectionName: "Skill 0", description: "0", items:[{name:'s0item1', progress:0},{name:'s0item2', progress:10}]},
					{sectionName: "Skill 1", description: "1", items:[{name:'s1item1', progress:10},{name:'s1item2', progress:20}]}
					]

			storedSkills = Helper.createNewSkills(skills);		
			
			request(url)
				.get('/api/skills')
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);

					_.forEach(res.body, function (elem, index) {
						elem.should.have.property('_id')
						elem.sectionName.should.equal('Skill ' + index);
			        	elem.description.should.equal(index.toString());
			        	elem.items[0].name.should.equal("s" + index + "item1");
			        	elem.items[0].progress.should.equal(index*10);
			        	elem.items[1].name.should.equal("s" + index + "item2");
			        	elem.items[1].progress.should.equal(index*10+10);
					})
				})
			done()
		});
	});

	describe('GET /skils/:id', function() {
		
		it('should get a skill', function(done) {
			var id = null; 
			var skill = {sectionName: "Skill 0", description: "0", items:[{name:'s0item1', progress:0},{name:'s0item2', progress:10}]};
			var storedSkill = Helper.createNewSkill(skill);
			storedSkill.then(function (docs) {
				id = docs._id;
				request(url)
					.get('/api/skills/'+id)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.should.have.property('_id')
						res.body.sectionName.should.equal('Skill 0');
			        	res.body.description.should.equal('0');
			        	res.body.items[0].name.should.equal("s0item1");
			        	res.body.items[0].progress.should.equal(0);
			        	res.body.items[1].name.should.equal("s0item2");
			        	res.body.items[1].progress.should.equal(10);
						done()	
					})
			}, function (err) {
				return done(err);
			}) 

		});
	});

	describe('PUT /skils/:id', function() {
		it('should update a skill', function (done) {
			var id = null;
			var updateContent= {
				sectionName: "Updated Skill",
				description: "Updated"
			} 
			var skill = {sectionName: "Skill 0", description: "0", items:[{name:'s0item1', progress:0},{name:'s0item2', progress:10}]};
			var storedSkill = Helper.createNewSkill(skill);
			storedSkill.then(function (docs) {
				id = docs._id;
				request(url)
					.put('/api/skills/'+id)
					.send(updateContent)
					.auth(config.adminName, config.adminPass)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.should.have.property('_id')
						res.body.sectionName.should.equal('Updated Skill');
			        	res.body.description.should.equal('Updated');
			        	res.body.items[0].name.should.equal("s0item1");
			        	res.body.items[0].progress.should.equal(0);
			        	res.body.items[1].name.should.equal("s0item2");
			        	res.body.items[1].progress.should.equal(10);
						done()
					})
			}, function (err) {
				return done(err);
			})

			
		})
		

		it('should not update a skill without auth', function (done) {
			Skill.remove({})
			var id = null;
			var updateContent= {
				sectionName: "Updated Skill",
				description: "Updated"
			} 
			var skill = {sectionName: "Skill 0", description: "0", items:[{name:'s0item1', progress:0},{name:'s0item2', progress:10}]};
			var storedSkill = Helper.createNewSkill(skill);
			storedSkill.then(function (docs) {
				id = docs._id;
				request(url)
					.put('/api/skills/'+id)
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

	describe('POST /skills', function() {
		it('should create a new skill', function(done) {
			var skill = {
				sectionName: "Skill Name",
				description: "Skill Description",
				items: [{name: "item1", progress: 20}, {name: "item2", progress: 30}]
			};
			request(url)
				.post('/api/skills')
				.send(skill)
				.auth(config.adminName, config.adminPass)
				.expect(200)
				.end(function(err,res) {
					if (err) return done(err)

					res.body.data.should.have.property('_id');
			        res.body.data.sectionName.should.equal('Skill Name');
			        res.body.data.description.should.equal('Skill Description');
			        res.body.data.items[0].name.should.equal("item1");
			        res.body.data.items[0].progress.should.equal(20);
			        res.body.data.items[1].name.should.equal("item2");
			        res.body.data.items[1].progress.should.equal(30);

			        done();
				});
		});

		it('should not create a new skill without auth', function(done) {
			var skill = {
				sectionName: "Skill Name",
				description: "Skill Description",
				items: [{name: "item1", progress: 20}, {name: "item2", progress: 30}]
			};
			request(url)
				.post('/api/skills')
				.send(skill)
				.expect(401)
				.end(function(err,res) {
					if (err) return done(err)

					res.error.text.should.equal('Unauthorized')
			        res.unauthorized.should.equal(true);
			        done();
				});
		});
	});

	describe('DELETE skills/:skill_id', function() {
		it('should delete a skill', function(done) {
			var id = null;
			var skill = {sectionName: "Skill 0", description: "0", items:[{name:'s0item1', progress:0},{name:'s0item2', progress:10}]};
			var storedSkill = Helper.createNewSkill(skill);
			storedSkill.then(function (docs) {
				id = docs._id;
				request(url)
					.delete('/api/skills/'+id)
					.auth(config.adminName, config.adminPass)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.message.should.equal('Skill Removed')
						done()
					})
			}, function (err) {
				return done(err);
			})

		});

		it('should not delete a skill without auth', function(done) {
			var id = null;
			var skill = {sectionName: "Skill 0", description: "0", items:[{name:'s0item1', progress:0},{name:'s0item2', progress:10}]};
			var storedSkill = Helper.createNewSkill(skill);
			storedSkill.then(function (docs) {
				id = docs._id;
				request(url)
					.delete('/api/skills/'+id)
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
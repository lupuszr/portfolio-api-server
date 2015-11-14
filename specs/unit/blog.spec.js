require('rootpath')();
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var db = require('db.js');
var config   = require('config.js')
var Blog = require('models/blog')
var Helper = require('specs/helpers/blogHelpers.js');
var _ = require('lodash')

describe('Blogs', function() {
	var url = 'http://localhost:5000';
	before(function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(db.testUrl,done);
	})

	beforeEach(function(done) {
			Blog.remove({}).then(function (argument) {
				done()
			})			
	});

	describe('POST /blogs', function() {
		it('should create a new blog', function(done) {
			var blog = {
				name: "Blog Name",
				description: "Blog Description",
				content: "Blog Content",
				comments: []
			};
			request(url)
				.post('/api/blogs')
				.send(blog)
				.auth(config.adminName, config.adminPass)
				.expect(200)
				.end(function(err,res) {
					if (err) return done(err)

					res.body.data.should.have.property('_id');
			        res.body.data.name.should.equal('Blog Name');
			        res.body.data.description.should.equal('Blog Description');
			        res.body.data.content.should.equal('Blog Content');
			        res.body.data.comments.should.deepEqual([]);
			        done();
				});
		});

		it('should not create a new blog without auth', function(done) {
			var blog = {
				name: "Blog Name",
				description: "Blog Description",
				content: "Blog Content",
				comments: []			
			};
			request(url)
				.post('/api/projects')
				.send(blog)
				.expect(401)
				.end(function(err,res) {
					if (err) return done(err)

					res.error.text.should.equal('Unauthorized')
			        res.unauthorized.should.equal(true);
			        done();
				});
		});
	});

	describe('GET /blogs', function() {

		it('should get all blogs', function(done) {
			
			var blogs = [
					{name: "Blog 0", description: "0",content: "Blog Content 0",comments: []},
					{name: "Blog 1", description: "1",content: "Blog Content 1",comments: []},
					]

			storedBlogs = Helper.createNewBlogs(blogs);		
			
			request(url)
				.get('/api/blogs')
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);

					_.forEach(res.body, function (elem, index) {
						elem.should.have.property('_id')
						elem.name.should.equal('Blog ' + index);
			        	elem.description.should.equal(index.toString());
			        	elem.content.should.equal("Blog Content " + index);
			        	elem.comments.should.deepEqual([])
					})
				})
			done()
		});
	});

	describe('GET /blogs/:blog_id', function() {
		
		it('should get a blog', function(done) {
			var id = null; 
			var blog = {
				name: "Blog Name",
				description: "Blog Description",
				content: "Blog Content",
				comments: []			
			};
			var storedBlog = Helper.createNewBlog(blog);
			storedBlog.then(function (docs) {
				id = docs._id;
				request(url)
					.get('/api/blogs/'+id)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.should.have.property('_id')
						res.body.name.should.equal('Blog Name');
			        	res.body.description.should.equal('Blog Description');
			        	res.body.content.should.equal("Blog Content");
			        	res.body.comments.should.deepEqual([]);
						done()	
					})
			}, function (err) {
				return done(err);
			}) 

		});
	});

	describe('PUT /blogs/:blog_id', function() {
		it('should update a blog', function (done) {
			var id = null;
			var updateContent= {
				name: "Updated Blog",
				description: "Updated"
			} 
			var blog = {
				name: "Blog Name",
				description: "Blog Description",
				content: "Blog Content",
				comments: []			
			};
			var storedBlog = Helper.createNewBlog(blog);
			storedBlog.then(function (docs) {
				id = docs._id;
				request(url)
					.put('/api/blogs/'+id)
					.send(updateContent)
					.auth(config.adminName, config.adminPass)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.should.have.property('_id')
						res.body.name.should.equal('Updated Blog');
			        	res.body.description.should.equal('Updated');
			        	res.body.content.should.equal("Blog Content");
			        	res.body.comments.should.deepEqual([]);

			        	done();
					})
			}, function (err) {
				return done(err);
			})
			
	 	})
		

		it('should not update a blog without auth', function (done) {
			Blog.remove({})
			var id = null;
			var updateContent= {
				name: "Updated Blog",
				description: "Updated"
			}
			var blog = {
				name: "Blog Name",
				description: "Blog Description",
				content: "Blog Content",
				comments: []			
			};
			var storedBlog = Helper.createNewBlog(blog);
			storedBlog.then(function (docs) {
				id = docs._id;
				request(url)
					.put('/api/blogs/'+id)
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

	describe('DELETE blogs/:blog_id', function() {
		it('should delete a blog', function(done) {
			var id = null;
			var blog = {
				name: "Blog Name",
				description: "Blog Description",
				content: "Blog Content",
				comments: []			
			};
			var storedBlog = Helper.createNewBlog(blog);
			storedBlog.then(function (docs) {
				id = docs._id;
				request(url)
					.delete('/api/blogs/'+id)
					.auth(config.adminName, config.adminPass)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.message.should.equal('Blog Removed')
						done()
					})
			}, function (err) {
				return done(err);
			})

		});

		it('should not delete a blog without auth', function(done) {
			var id = null;
			var blog = {
				name: "Blog Name",
				description: "Blog Description",
				content: "Blog Content",
				comments: []			
			};
			var storedBlog = Helper.createNewBlog(blog);
			storedBlog.then(function (docs) {
				id = docs._id;
				request(url)
					.delete('/api/blogs/'+id)
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
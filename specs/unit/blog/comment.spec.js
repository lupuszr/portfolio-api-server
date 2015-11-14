require('rootpath')();
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var db = require('db.js');
var config   = require('config.js')
var Blog = require('models/blog')
var blogHelper = require('specs/helpers/blogHelpers.js');
var Helper = require('specs/helpers/commentHelpers.js');
var _ = require('lodash')



var blogId = null;
var blog = null;

after(function(done){
    Blog.remove({}).then(function (argument) {
 		done()
 	})
});

describe('Blog Comments', function() {
	var url = 'http://localhost:5000';
	
	before(function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(db.testUrl,done);
	})

	beforeEach(function (done) {
		var blog = {
				name: "Blog Name",
				description: "Blog Description",
				content: "Blog Content",
				comments: []			
			};
		var storedBlog = blogHelper.createNewBlog(blog);
		storedBlog.then(function (docs) {
			blogId = docs._id;
			blog = docs;
			done()
		}, function (err) {
			return done(err);
		})
	})



	describe('POST /blogs/:blog_id/comments/', function() {
		it('should create a comment', function(done) {
			var comment = {
				authorName: "Author",
				authorEmail: "author@testing.com",
				response: "response"
			};
			request(url)
				.post('/api/blogs/' + blogId + '/comments')
				.send(comment)
				.expect(200)
				.end(function(err,res) {
					if (err) { 
						return done(err)
					}
					res.body.data.should.have.property('_id');
			        res.body.data.authorName.should.equal('Author');
			        res.body.data.authorEmail.should.equal('author@testing.com');
			        res.body.data.response.should.equal('response');
			        done();
				});
		});

	});

	describe('GET /blogs/:blog_id/comments', function() {

		it('should get all the belonging comments', function(done) {
			
			var comments = [
						{ authorName: "Author 0", authorEmail: "author0@testing.com", response: "response 0"},
						{ authorName: "Author 1", authorEmail: "author1@testing.com", response: "response 1"}
						];

			storedComments = Helper.createNewComments(blogId, comments);		
			request(url)
				.get('/api/blogs/' + blogId + '/comments')
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);

					_.forEach(res.body, function (elem, index) {
						elem.should.have.property('_id')
			        	elem.authorName.should.equal('Author ' + index);
			        	elem.authorEmail.should.equal('author' + index + '@testing.com');
			        	elem.response.should.equal('response ' + index);
					})
				done()
				})
		});
	});

	describe('GET /blogs/:blog_id/comments/:comment_id', function() {
		
		it('should get a comment', function(done) {
			var id = null; 
			var comment = {
				authorName: "Author",
				authorEmail: "author@testing.com",
				response: "response"
			};
			
			Helper.createNewComment(blogId, comment, function(model) {
				id = model.comments[0]._id
				request(url)
					.get('/api/blogs/'+blogId + '/comments/' + id)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)

						res.body.should.have.property('_id')
						res.body.authorName.should.equal('Author');
			        	res.body.authorEmail.should.equal('author@testing.com');
			        	res.body.response.should.equal("response");
						done()	
					})
			});
				
			 

		});
	});


	describe('DELETE blogs/:blog_id/comments/:comment_id', function() {
		it('should delete a comment', function(done) {
			var id = null;
			var comment = {
				authorName: "Author",
				authorEmail: "author@testing.com",
				response: "response"
			};
			
			Helper.createNewComment(blogId, comment, function(model) {
				id = model.comments[0]._id;
				request(url)
					.delete('/api/blogs/'+blogId + '/comments/' + id)
					.auth(config.adminName, config.adminPass)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err)
						res.body.should.equal('Comment has been removed')
						done()
					})
			}, function (err) {
				return done(err);
			})

		});
	});
});
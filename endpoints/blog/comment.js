var Blog = require('../../models/blog');
var auth = require('./../auth')

var show = function(req, res) {

	Blog.findById(req.params.blog_id, function(err, blog) {
		if (err)
			res.send(err);

		comment = blog.comments.id(req.params.comment_id)

		res.json(comment);
	})
}

var reply = function(req, res){
	var reply = { authorName: "", authorEmail: "", response: "" }
	reply.authorName = req.body.authorName;
	reply.authorEmail = req.body.authorEmail;
	reply.response = req.body.response;

	Blog.findById(req.params.blog_id, function(err, blog) {
		if (err)
			res.send(err);

		comment = blog.comments.id(req.params.comment_id)
		comment.replies.push(reply)

		blog.save(function  (err) {
			if (err){ 
				res.send(err);
				return;
			}
			res.json({ message: 'Reply added', data: comment.replies.pop()})
		})
	})

}


var destroy = function(req, res){
	
	Blog.findById(req.params.blog_id, function(err, blog){
		if(err)
			res.send(err)

		blog.comments.id(req.params.comment_id).remove()

		blog.save(function  (err) {
			if (err) 
				res.send(err);

			res.json('Comment has been removed')
		})		
	})
}

var index = function(req, res) {
	Blog.findById(req.params.blog_id, function(err, blog) {
		if (err)
			res.send(err);

		res.json(blog.comments);
	})
}

var create = function(req, res) {
	
	var comment = { authorName: "", authorEmail: "", response: "" }
	comment.authorName = req.body.authorName;
	comment.authorEmail = req.body.authorEmail;
	comment.response = req.body.response;

	Blog.findById(req.params.blog_id, function(err, blog) {
		if (err)
			res.send(err);

		if (!!blog === false){
			res.send(err);
			return;
		}

		blog.comments.push(comment)
		blog.save(function  (err) {
			if (err){ 
				res.send(err);
				return;
			}
			res.json({ message: 'Comment added', data: blog.comments.pop()})
		})
	})	
} 

module.exports.bindRoutes = function(collection, elem){
	collection
		.get(index)
		.post(create);

	elem
		.get(show)
		.post(reply)
		.delete(auth.isAuthenticated, destroy)
}
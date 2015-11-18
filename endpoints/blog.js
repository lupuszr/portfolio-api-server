var Blog = require('../models/blog');
var auth = require('./auth')
var inspectUtil = require('../utils/inspectUtil')

var show = function(req, res) {
  	req.checkParams('blog_id', 'Invalid urlparam').isMongoId();

  	var errors = req.validationErrors();
  	if (errors) {
    	res.status(400).send('There have been validation errors: ' +  inspectUtil(errors,""));
    	return;
  	}

	Blog.findById(req.params.blog_id, function(err, blog) {
		if (err)
			res.send(err);

		res.json(blog);
	})
}

var update = function(req, res) {
	req.checkParams('blog_id', 'Invalid urlparam').isMongoId();

	var errors = req.validationErrors();
  	if (errors) {
    	res.status(400).send('There have been validation errors: ' +  util.inspect(errors));
    	return;
  	}

	Blog.findById(req.params.blog_id, function(err, blog) {
		if (err){
			res.send(err)
		}
		if (!!blog === false){
			res.send("No such blog")
			return;
		}
		for (var key in req.body) {
			if (req.body.hasOwnProperty(key)) {
  				switch(key){
  					case "name":
  						blog.name = req.body.name;
  						break;
  					case "description":
  						blog.description = req.body.description;
  						break;
  					case "content":
  						blog.content = req.body.content;
  						break;
  					default: break;
  				}
  			}
  		}

  		blog.save(function (err) {
  			if(err)
  				res.send(err);

  			res.json(blog);
  		})
	})
}

var destroy = function(req, res){
	req.checkParams('blog_id', 'Invalid urlparam').isMongoId();

	var errors = req.validationErrors();
  	if (errors) {
    	res.status(400).send('There have been validation errors: ' +  util.inspect(errors));
    	return;
  	}

	Blog.findByIdAndRemove(req.params.blog_id, function(err){
		if(err)
			res.send(err)

		res.json({message: "Blog Removed"})
	})
}

var index = function(req, res) {
	Blog.find({},'name description', function (err, blogs) {
		if (err) res.send(err);
			res.send(blogs)
	})	
}

var create = function(req, res) {
	req.checkBody('name', 'Invalid postparam').notEmpty().isAlphanumeric();
	req.checkBody('description', 'Invalid postparam').notEmpty().isAlphanumeric();
	req.checkBody('content', 'Invalid postparam').notEmpty().isAlphanumeric();
	

	var errors = req.validationErrors();
  	if (errors) {
    	res.status(400).send('There have been validation errors: ' +  inspectUtil(errors,"errors"));
    	return;
  	}

	var blog = new Blog()
	blog.name = req.body.name;
	blog.description = req.body.description;
	blog.content = req.body.content;

	blog.save(function  (err) {
		if (err) 
			res.send(err);

		res.json({ message: 'Blog added', data: blog})
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
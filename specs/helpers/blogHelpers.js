var _ = require('lodash');
var Blog = require('models/blog.js')


var createNewBlog = function(blogObj){
	
	return new Blog(blogObj).save(function(err, model){
		if (err) return err;
		return model;
	})
}

var createNewBlogs = function(blogObjArray){
	return _.map(blogObjArray, createNewBlog);
}

module.exports = {
	createNewBlog: createNewBlog,
	createNewBlogs: createNewBlogs
}
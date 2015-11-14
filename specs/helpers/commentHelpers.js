var _ = require('lodash');
var Blog = require('models/blog.js')

var createNewComment = function(blogId, commentObj, success){
	return Blog.findById(blogId, function(err, blog){
		if (err) return err;
		blog.comments.push(commentObj);
		return  blog.save(function(err, model){
			if (err) {console.log(err); return err};
			
			return success(model);	
		})
	})
}

var createNewComments = function(blogId, commentObjArray){
	return _.map(commentObjArray, function (elem) {
		createNewComment(blogId, elem, function (model) {
			return model;
		})
	});
}

module.exports = {
	createNewComment: createNewComment,
	createNewComments: createNewComments
}
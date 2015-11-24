var mongoose = require('mongoose');


var ReplySchema = new mongoose.Schema({
	authorName: String,
	authorEmail: String,
	response: String,
	created_at : Date,
});

ReplySchema.pre('save', function(next){
	this.created_at = new Date();
	next();
})

var CommentSchema = new mongoose.Schema({
	authorName: String,
	authorEmail: String,
	response: String,
	created_at : Date,
	replies: [ReplySchema]
});

CommentSchema.pre('save', function(next){
	this.created_at = new Date();
	next();
})

var BlogSchema = new mongoose.Schema({
	name: String,
	description: String,
	content: String,
	updated_at : Date,
	created_at : Date, 
	comments: [CommentSchema]
})

BlogSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
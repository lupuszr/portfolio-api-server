var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	authorName: String,
	authorEmail: String,
	response: String,
	created_at : Date
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

// BlogSchema.statics.Filtered = function (selector, cb) {
//   var query = this.find({}).select(selector)

//   query.exec(function (err, model){
//   	cb(err,model)
//   })
// }

BlogSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var dbConfig = require('./db.js');
var bodyParser = require('body-parser');
var passport = require('passport');

var projectEndpoint = require('./endpoints/project')
var skillEndpoint = require('./endpoints/skill')
var blogEndpoint = require('./endpoints/blog')
var blogCommentEndpoint = require('./endpoints/blog/comment')
var app = express();




app.use(bodyParser.json());

app.use(passport.initialize())

switch(app.get('env')){
	case 'testing':
  		//app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  		mongoose.connect(dbConfig.testUrl);
  		break;
	case 'development':
  		mongoose.connect(dbConfig.url);
		break;
	case 'production': 
		//app.use(express.errorHandler()); 
  		mongoose.connect(dbConfig.url);
  		break;
  	default:
  		mongoose.connect(dbConfig.url);
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'This is an api server'})
})

projectEndpoint.bindRoutes(router.route('/projects/'),router.route('/projects/:project_id'))
skillEndpoint.bindRoutes(router.route('/skills/'),router.route('/skills/:skill_id'))
blogEndpoint.bindRoutes(router.route('/blogs/'), router.route('/blogs/:blog_id'))
blogCommentEndpoint.bindRoutes(router.route('/blogs/:blog_id/comments'), router.route('/blogs/:blog_id/comments/:comment_id'))
app.use('/api', router);

app.listen(process.env.PORT || 5000);
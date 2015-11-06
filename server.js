var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('./db.js');
var bodyParser = require('body-parser');
var passport = require('passport');

var projectEndpoint = require('./endpoints/project')
var app = express();

var port = 3001;



app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(passport.initialize())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(dbConfig.url);
var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'This is an api server'})
})

projectEndpoint.bindRoutes(router.route('/projects/'),router.route('/projects/:project_id'))
app.use('/api', router);

app.listen(port);
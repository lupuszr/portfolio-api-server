var User = require('../models/user');
var nconf = require('nconf');
var mongoose = require('mongoose');
var dbConfig = require('../db.js');


var db = mongoose.connect(dbConfig.url);


nconf.argv()
	.env();

var adminName =  nconf.get('ADMIN_NAME')
var password = nconf.get('ADMIN_PASSWORD');

var user = new User({
	username: adminName,
	password: password
});

user.save(function(err) {
	if (err)
		console.log("Admin creation failed")

	console.log('Admin has been created');
	db.disconnect();
});
	

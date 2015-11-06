var User = require('../models/user');
var auth = require('./auth');

var create = function (req, res) {
	var user = new User({
		username: req.body.username,
		password: req.body.password
	});

	user.save(function(err) {
		if (err)
			res.send(err);

		res.json({ message: user.username + 'has been created'});
	});

}

module.exports.bindRoutes = function(collection, elem){
	collection
//		.get(auth.isAuthenticated, index);
		.post(auth.isAuthenticated, create);

	// elem
	// 	.get(auth.isAuthenticated, show)
	// 	.put(auth.isAuthenticated, update)
	// 	.delete(auth.isAuthenticated, destroy)
}
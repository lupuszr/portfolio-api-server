var nconf = require('nconf');

nconf.argv()
	.env();


module.exports = function ifEnv(env, success, err){
	if (nconf.get('NODE_ENV') === env){
		return success;
	}else {
		return err;
	} 
} 
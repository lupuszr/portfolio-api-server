var ifEnv = require('./ifEnv')
var util = ifEnv("development",
	function(){ 
		return require('util')
	}, 
	function () {
		return null;
	})

var inspectUtil = function(input, cb){
	if (util){
		return util.inspect(input);
	}

	return cb;
}

module.exports = inspectUtil;




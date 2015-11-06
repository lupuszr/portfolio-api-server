var nconf = require('nconf');

nconf.argv()
	.env();

module.exports = {
  'url' : nconf.get('MONGOLAB_URI')
}
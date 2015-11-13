var nconf = require('nconf');

nconf.argv()
	.env();

module.exports = {
  'url' : nconf.get('MONGOLAB_URI'),
  'testUrl' : nconf.get('TEST_MONGO_URI')
}
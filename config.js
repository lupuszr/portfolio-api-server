var nconf = require('nconf');

nconf.argv()
	.env();

module.exports = {
  'adminName' : nconf.get('ADMIN_NAME'),
  'adminPass' : nconf.get('ADMIN_PASSWORD'),
  'url' : nconf.get('MONGOLAB_URI'),
  'testUrl' : nconf.get('TEST_MONGO_URI'),
  'testServerUrl' : "http://localhost:5000"
}
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-mocha-test');
	
	grunt.initConfig({
		  	pkg: grunt.file.readJSON('package.json')
	});

	grunt.config( 'mochaTest', require('./grunt/mochaTest.js') );

	grunt.registerTask('default','mochaTest')
}
module.exports = function(config) {
	'use strict';
	config.set({
		basePath: '../',
		singleRun: true,
		frameworks: ['jasmine', 'jasmine-matchers', 'requirejs'],
		browsers: ['PhantomJS'],
		reporters: ['dots']
  });
};

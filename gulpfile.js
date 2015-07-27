'use strict';

var del         = require('del');
var gulp        = require('gulp');
var header      = require('gulp-header');
var jshint      = require('gulp-jshint');
var karma       = require('karma').server;
var pkg         = require('./package.json');
var rename      = require('gulp-rename');
var runSequence = require('run-sequence').use(gulp);
var stylish     = require('jshint-stylish');
var uglify      = require('gulp-uglify');
var umd         = require('gulp-umd');

var jsFiles = [
	'gulpfile.js',
	'angular-file-upload.js',
	'test/*.js'
];

var angularVersions = [
	'angular-1.2',
	'angular-1.3',
	'angular-1.4'
];

var testFilesFor = function(angularPath) {
	return [
		{ pattern: 'bower_components/angular-file-upload/**/*.js', included: false },
		{ pattern: 'node_modules/**/*.js', included: false },
		{ pattern: 'dist/*.js', included: false },
		{ pattern: 'test/test-*.js', included: false },
		{ pattern: 'test/' + angularPath + '/bower_components/**/*.js', included: false },
		'test/requirejs.conf.js',
		'test/' + angularPath + '/requirejs.conf.js'
	];
};

gulp.task('lint', function() {
	return gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('clean', function(done) {
	del('./dist', done);
});

gulp.task('build', ['clean'], function() {
	var banner = ['/*!',
		' * <%= pkg.name %> v<%= pkg.version %>',
		' * <%= pkg.homepage %>',
		' * (c) 2015 Jack Henry & Associates Inc',
		' * License: <%= pkg.license %>',
		' */',
		''].join('\n');

	return gulp.src('angular-file-upload.js')
		.pipe(umd({
			dependencies: function() {
				return [{
					name: 'angular',
					amd: 'angular',
					cjs: 'angular',
					global: 'angular',
					param: 'angular',
				}, {
					name: 'angular-cookies',
					amd: 'angular-cookies',
					cjs: 'angular-cookies',
					global: 'unused',
					param: 'unused'
				}, {
					name: 'angular-file-upload',
					amd: 'angular-file-upload',
					cjs: 'angular-file-upload',
					global: 'unused',
					param: 'unused'
				}];
			},
			exports: function() { return '"banno.fileUploader"'; },
			namespace: function() { return 'banno = root.banno || {}; root.banno.fileUploader'; }
		}))
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('./dist'))
		.pipe(uglify({ preserveComments: 'some' }))
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('./dist'));
});

angularVersions.forEach(function(val) {
	gulp.task('test:' + val, function(done) {
		karma.start({
			configFile: __dirname + '/test/karma.conf.js',
			files: testFilesFor(val)
		}, done);
	});
});

gulp.task('test', function(done) {
	return runSequence.apply(this, angularVersions.map(function(val) { return 'test:' + val; }).concat(done));
});

gulp.task('all', function(done) {
	return runSequence(['lint', 'build'], 'test', done);
});

gulp.task('watch', function() {
	gulp.watch(jsFiles.concat('.jshintrc'), ['all']);
});

gulp.task('default', ['all', 'watch']);

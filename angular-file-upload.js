angular.module('banno.fileUploader', ['ngCookies', 'angularFileUpload']).factory('BannoUploader', [
	'$cookies', '$http', 'FileUploader', function($cookies, $http, ParentClass)
{
	'use strict';

	var defaultOpts = {
		autoUpload: true,
		queueLimit: 1,
		headers: {},
		xsrfHeaderName: $http.defaults.xsrfHeaderName,
		xsrfCookieName: $http.defaults.xsrfCookieName
	};

	function FileUploader(url, opts) {
		// Check for a URL.
		if (!url) {
			throw new Error('BannoUploader constructor requires a URL argument');
		}

		// Build the options collection.
		opts = angular.extend({}, defaultOpts, { url: url }, opts);

		// Add in the XSRF header.
		if (opts.xsrfHeaderName) {
			opts.headers[opts.xsrfHeaderName] = $cookies.get(opts.xsrfCookieName);
		}

		// Call the parent constructor.
		ParentClass.call(this, opts);
	}

	FileUploader.prototype = Object.create(ParentClass.prototype, {});
	FileUploader.prototype.constructor = FileUploader;

	return FileUploader;
}]);

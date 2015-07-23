/*!
 * banno-file-upload v1.0.0
 * https://github.com/Banno/angular-file-upload
 * (c) 2015 Jack Henry & Associates Inc
 * License: Apache-2.0
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['angular', 'angular-cookies', 'angular-file-upload'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'), require('angular-cookies'), require('angular-file-upload'));
  } else {
    root.banno = root.banno || {}; root.banno.fileUploader = factory(root.angular, root.unused, root.unused);
  }
}(this, function(angular, unused, unused) {
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

return "banno.fileUploader";
}));

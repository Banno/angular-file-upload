var uploaderModule = angular.module('banno.fileUploader', ['ngCookies', 'angularFileUpload']);

uploaderModule.factory('BannoUploader', ['$cookies', '$http', 'FileUploader', function($cookies, $http, ParentClass) {
	'use strict';

	var defaultOpts = {
		autoUpload: true,
		queueLimit: 1,
		headers: {},
		xsrfHeaderName: $http.defaults.xsrfHeaderName,
		xsrfCookieName: $http.defaults.xsrfCookieName
	};

	// Angular 1.4 changed the $cookies API from properties to get().
	function getCookie(name) {
		return (typeof $cookies.get === 'function' ? $cookies.get(name) : $cookies[name]);
	}

	function FileUploader(url, opts) {
		// Check for a URL.
		if (!url) {
			throw new Error('BannoUploader constructor requires a URL argument');
		}

		// Build the options collection.
		opts = angular.extend({}, defaultOpts, { url: url }, opts);

		// Add in the XSRF header.
		if (opts.xsrfHeaderName) {
			opts.headers[opts.xsrfHeaderName] =  getCookie(opts.xsrfCookieName);
		}

		// Call the parent constructor.
		ParentClass.call(this, opts);
	}

	FileUploader.prototype = Object.create(ParentClass.prototype, {});
	FileUploader.prototype.constructor = FileUploader;

	for(var prop in ParentClass) {
		if (ParentClass.hasOwnProperty(prop)) {
			FileUploader[prop] = ParentClass[prop];
		}
	}

	return FileUploader;
}]);

// Create directive aliases without the "nv" prefix.
// How to add-in directive from another directive: http://stackoverflow.com/a/19228302
var aliases = {
	'upload-selected': 'nv-file-select',
	'upload-dropped': 'nv-file-drop',
	'upload-over-class': 'nv-file-over'
};

var aliasElement = function(element, attrName) {
	'use strict';

	// Remember the original value.
	var oldVal = element.attr(attrName);

	// Remove the original attribute, replace it with the "nv-" version.
	element.attr(aliases[attrName], '');
	element.removeAttr(attrName, '');
	element.removeAttr('data-' + attrName, ''); // alternate syntax

	return oldVal;
};

uploaderModule.directive('uploadSelected', ['$compile', function($compile) {
	'use strict';
	return {
		restrict: 'A',
		replace: false,
		terminal: true,
		priority: 1000,
		link: function(scope, element, attrs) {
			aliasElement(element, 'upload-selected');
			$compile(element)(scope);
		}
	};
}]);

uploaderModule.directive('uploadDropped', ['$compile', function($compile) {
	'use strict';
	return {
		restrict: 'A',
		replace: false,
		terminal: true,
		priority: 1000,
		link: function(scope, element, attrs) {
			aliasElement(element, 'upload-dropped');
			$compile(element)(scope);
		}
	};
}]);

uploaderModule.directive('uploadOverClass', ['$compile', function($compile) {
	'use strict';
	return {
		restrict: 'A',
		replace: false,
		terminal: true,
		priority: 1000,
		link: function(scope, element, attrs) {
			var val = aliasElement(element, 'upload-over-class');
			element.attr('over-class', val);
			$compile(element)(scope);
		}
	};
}]);

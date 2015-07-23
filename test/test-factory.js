define(['testModule'], function() {
	'use strict';

	describe('BannoUploader', function() {

		var BannoUploader;
		var testUrl = 'http://example.com/';

		beforeEach(module('banno.fileUploader'));

		beforeEach(inject(function(_BannoUploader_) {
			BannoUploader = _BannoUploader_;
		}));

		it('should construct a new BannoUploader object', function() {
			var obj = new BannoUploader(testUrl);
			expect(obj).toEqual(jasmine.any(Object));
			expect(obj instanceof BannoUploader).toBe(true);
		});

		it('should throw an error if no URL is passed', function() {
			expect(function() {
				var obj = new BannoUploader();
			}).toThrow();
		});

		it('should use the URL passed to the constructor', function() {
			var obj = new BannoUploader(testUrl);
			expect(obj.url).toBe(testUrl);
		});

		it('should auto-upload by default', function() {
			var obj = new BannoUploader(testUrl);
			expect(obj.autoUpload).toBe(true);
		});

		it('should default to a queue limit of 1', function() {
			var obj = new BannoUploader(testUrl);
			expect(obj.queueLimit).toBe(1);
		});

		it('should override the default options with the passed object', function() {
			var overrides = {
				autoUpload: false,
				method: 'FOO',
				url: 'http://example.com/2'
			};
			var obj = new BannoUploader(testUrl, overrides);
			expect(obj.autoUpload).toBe(overrides.autoUpload);
			expect(obj.method).toBe(overrides.method);
			expect(obj.url).toBe(overrides.url);
		});

		it('should have a queue', function() {
			var obj = new BannoUploader(testUrl);
			expect(obj.queue).toBeArray();
		});

		it('should have filters', function() {
			var obj = new BannoUploader(testUrl);
			expect(obj.filters).toBeArray();
		});

		it('should have callbacks', function() {
			var obj = new BannoUploader(testUrl);
			expect(obj.onAfterAddingFile).toBeFunction();
			expect(obj.onBeforeUploadItem).toBeFunction();
			expect(obj.onProgressItem).toBeFunction();
			expect(obj.onSuccessItem).toBeFunction();
			expect(obj.onErrorItem).toBeFunction();
			expect(obj.onCancelItem).toBeFunction();
			expect(obj.onCompleteItem).toBeFunction();
			expect(obj.onCompleteAll).toBeFunction();
		});

		it('should set an XSRF header', inject(function($http) {
			var obj = new BannoUploader(testUrl);
			expect(Object.keys(obj.headers)).toContain($http.defaults.xsrfHeaderName);
		}));

		it('should use the XSRF token from the cookie', inject(function($http, $cookies) {
			var xsrfToken = 'foobar';
			$cookies.put($http.defaults.xsrfCookieName, xsrfToken);
			var obj = new BannoUploader(testUrl);
			expect(obj.headers[$http.defaults.xsrfHeaderName]).toBe(xsrfToken);
		}));

		it('should allow the XSRF names to be overridden', inject(function($cookies) {
			var xsrfToken = 'foobar';
			var opts = {
				xsrfHeaderName: 'XSRF-HEADER-NAME',
				xsrfCookieName: 'XSRF-COOKIE-NAME'
			};
			$cookies.put(opts.xsrfCookieName, xsrfToken);
			var obj = new BannoUploader(testUrl, opts);
			expect(obj.headers[opts.xsrfHeaderName]).toBe(xsrfToken);
		}));

		it('should not add an XSRF header if xsrfHeaderName is falsy', inject(function($http) {
			var opts = {
				xsrfHeaderName: null
			};
			var obj = new BannoUploader(testUrl, opts);
			expect(Object.keys(obj.headers)).not.toContain($http.defaults.xsrfHeaderName);
		}));

	});

});

define(['testModule'], function() {
	'use strict';

	describe('directives', function() {

		var $compile, $rootScope, BannoUploader;
		var el;

		var testUrl = 'http://example.com/';
		var dummyFiles = [
			{ foo: 'bar' }
		];

		var createElement = function(html) {
			var scope = $rootScope.$new();
			scope.uploader = new BannoUploader(testUrl, {
				autoUpload: false
			});
			spyOn(scope.uploader, 'addToQueue').and.callThrough();
			scope.uploader.filters = []; // remove default filters

			el = angular.element(html);
			$compile(el)(scope);

			scope.$apply();
		};

		beforeEach(module('banno.fileUploader'));

		beforeEach(inject(function(_$compile_, _$rootScope_, _BannoUploader_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			BannoUploader = _BannoUploader_;
		}));

		describe('upload-selected', function() {

			it('should throw an error if no "uploader" attribute is used', function() {
				expect(function() {
					createElement('<input type="file" upload-selected></input>');
				}).toThrow();
			});

			it('should act like a "nv-file-select" directive', function() {
				createElement('<input type="file" upload-selected uploader="uploader"></input>');
				angular.element(el[0]).triggerHandler({
					type: 'change'
				});
				expect(el.scope().uploader.addToQueue).toHaveBeenCalled();
			});

		});

		describe('upload-dropped', function() {

			it('should throw an error if no "uploader" attribute is used', function() {
				expect(function() {
					createElement('<div upload-dropped></div>');
				}).toThrow();
			});

			it('should act like a "nv-file-drop" directive', function() {
				createElement('<div upload-dropped uploader="uploader"></div>');
				angular.element(el[0]).triggerHandler({
					type: 'drop',
					dataTransfer: {
						files: dummyFiles
					}
				});
				expect(el.scope().uploader.addToQueue).toHaveBeenCalled();
			});

		});

		describe('upload-over-class', function() {

			it('should throw an error if no "uploader" attribute is used', function() {
				expect(function() {
					createElement('<div upload-over-class></div>');
				}).toThrow();
			});

			it('should act like a "nv-file-over" directive, but takes the CSS class directly', function() {
				createElement('<div upload-over-class="cssClassName" uploader="uploader"></div>');
				// also buried down in: el.scope().uploader._directives.over[0].getOverClass()
				expect(el.attr('over-class')).toBe('cssClassName');
			});

			it('should work in tandem with upload-dropped', function() {
				createElement('<div upload-dropped upload-over-class="cssClassName" uploader="uploader"></div>');
				angular.element(el[0]).triggerHandler({
					type: 'drop',
					dataTransfer: {
						files: dummyFiles
					}
				});
				expect(el.scope().uploader.addToQueue).toHaveBeenCalled();
				expect(el.attr('over-class')).toBe('cssClassName');
			});

		});

	});

});

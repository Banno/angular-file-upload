# banno-file-upload

This library provides a simple factory and directives for file uploading in Angular.

At the moment it's a thin wrapper around [nervgh's angular-file-upload](https://github.com/nervgh/angular-file-upload/) library, with the following added features:

* Wraps the library inside the [UMD pattern](https://github.com/umdjs/umd) for module loaders.
* Sends an HTTP header (`X-XSRF-TOKEN`) with the CSRF token.

## Requirements

* [AngularJS](https://angularjs.org/) v1.2+ and [ngCookies](https://docs.angularjs.org/api/ngCookies)
* [angular-file-upload](https://github.com/nervgh/angular-file-upload/)
* ES5 support, or a [shim](https://github.com/es-shims/es5-shim)

## Installation

```shell
bower install --save banno-file-upload
```

## Usage

To use, include `banno.fileUploader` in your Angular module.

```javascript
angular.module('myApp', ['banno.fileUploader'])
.controller('myController', function($scope, BannoUploader) {
  $scope.uploader = new BannoUploader('http://example.com/api/upload', {
    removeAfterUpload: true
  });
});
```

```html
<div ng-app="app">
    <div ng-controller="myController">
        <input type="file" upload-selected uploader="uploader"/><br/>
        <ul>
            <li ng-repeat="item in uploader.queue">
                Name: <span ng-bind="item.file.name"></span><br/>
                <button ng-click="item.upload()">upload</button>
            </li>
        </ul>
    </div>
</div>
```

* Create uploader instances in your controller by calling `new BannoUploader(uploadUrl)`.
* Upload files through a file selection element with `upload-selected`:

    ```html
    <input type="file" upload-selected uploader="{your BannoUploader instance}">
    ```

* Upload files through drag-and-drop by specifying a `upload-dropped` destination element:

    ```html
    <element upload-dropped uploader="{your BannoUploader instance}"></element>
    ```

  To add a CSS class to a `upload-dropped` element when a user has dragged a file over the drop area, use `upload-over-class`:

    ```html
    <element upload-dropped upload-over-class="cssClass" uploader="{your BannoUploader instance}"></element>
    ```

For details on the available options and the APIs, see the [documentation for the library](https://github.com/nervgh/angular-file-upload/wiki/Module-API) that this library is based on.

## Configuration

When creating a new BannoUploader instance, you can also pass an object to configure the uploader:

```javascript
$scope.uploader = new BannoUploader('http://example.com/api/upload', {
  autoUpload: false,
  removeAfterUpload: true
});
```

The default options are:

```javascript
{
  method: 'POST',
  autoUpload: true,
  queueLimit: 1
}
```

## CSRF / XSRF Protection

By default the uploader will send a [CSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery) HTTP header, using a value from the site cookie. It uses the names defined in [`$http.defaults`](https://docs.angularjs.org/api/ng/service/$http#cross-site-request-forgery-xsrf-protection). These names can be overridden by passing `xsrfHeaderName` and `xsrfCookieName` options to the BannoUploader constructor:

```javascript
$scope.uploader = new BannoUploader('http://example.com/api/upload', {
  xsrfHeaderName: 'X-CSRF',
  xsrfCookieName: 'csrf_token'
});
```

To not send a CSRF header, use a falsy value for `xsrfHeaderName`:

```javascript
$scope.uploader = new BannoUploader('http://example.com/api/upload', {
  xsrfHeaderName: null
});
```

This library can either be loaded through the normal `<script>` tags, or by a module loader such as RequireJS.

## Contributing

You'll need [gulp](http://gulpjs.com/) installed on your machine to run the development tools. Then run `gulp` to run all of the tasks and watch the files for changes.

Please add tests and maintain the existing styling when adding and updating the code.

## Bugs & Feature Requests

Have an issue or feature request? Please [open a new issue](https://github.com/Banno/angular-file-upload/issues/new).

## License

Copyright 2015 [Jack Henry & Associates Inc](https://www.jackhenry.com/).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

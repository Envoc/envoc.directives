(function(module) {
try {
  module = angular.module('envoc.directives.partials');
} catch (e) {
  module = angular.module('envoc.directives.partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/oValidationMessageFor.tmpl.html',
    '﻿<div>\n' +
    '    <!-- This is where the content of the tag gets replaced -->\n' +
    '    <div ng-transclude></div>\n' +
    '\n' +
    '    <!-- Errors here -->\n' +
    '    <ul class="list-unstyled" ng-show="matches.length" ng-class="{\'alert alert-danger\': matches.length}">\n' +
    '        <li ng-repeat="error in matches">\n' +
    '            <span class="field-validation-error">{{error.errorMessage}}</span>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</div>');
}]);
})();

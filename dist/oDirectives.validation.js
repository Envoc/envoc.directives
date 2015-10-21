/*
 * envoc.directives 0.11.1
 * Author: Envoc
 * Repository: https://github.com/Envoc/envoc.directives
 */
(function(module) {
try {
  module = angular.module('envoc.directives.partials');
} catch (e) {
  module = angular.module('envoc.directives.partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/validation/oValidationMessageFor.tmpl.html',
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

(function(module) {
try {
  module = angular.module('envoc.directives.partials');
} catch (e) {
  module = angular.module('envoc.directives.partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/validation/oValidationMessageForModelstate.tmpl.html',
    '<div>\n' +
    '    <!-- This is where the content of the tag gets replaced -->\n' +
    '    <div ng-transclude></div>\n' +
    '\n' +
    '    <!-- Errors here -->\n' +
    '    <ul class="list-unstyled" ng-show="matches.errors.length" ng-class="{\'alert alert-danger\': matches.errors.length}">\n' +
    '        <li ng-repeat="error in matches.errors">\n' +
    '            <span class="field-validation-error">{{error.errorMessage}}</span>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('envoc.directives.partials');
} catch (e) {
  module = angular.module('envoc.directives.partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/validation/oValidationSummary.tmpl.html',
    '﻿<div ng-show="errors.length" ng-class="{\'alert alert-danger alert-block\': errors.length}">\n' +
    '    <strong>Please fix the error{{ errors.length > 1 ? \'s\' : \'\'}} listed below and try again</strong>\n' +
    '    <ul style="padding-left:30px">\n' +
    '        <li ng-repeat="error in errors">\n' +
    '            {{error.errorMessage}}\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</div>\n' +
    '');
}]);
})();

(function() {
  'use strict';

  angular.module('envoc.directives.validation', ['envoc.directives.partials'])
    .provider('oValidateConfig', function() {
      var config = {
        templates: {
          oValidationMessageFor: '/oTemplates/validation/oValidationMessageFor.tmpl.html',
          oValidationMessageForModelstate: '/oTemplates/validation/oValidationMessageForModelstate.tmpl.html',
          oValidationSummary: '/oTemplates/validation/oValidationSummary.tmpl.html'
        }
      };
      return {
        config: config,
        $get: function() {
          return config;
        }
      }
    });
})();

﻿(function() {
    'use strict';

    angular
        .module('envoc.directives.validation')
        .directive('oValidateWith', [
            function() {
                var noop = function() {};
                var nullFormCtrl = {
                    $addControl: noop,
                    $removeControl: noop,
                    $setValidity: noop,
                    $setDirty: noop,
                    $setPristine: noop
                };

                return {
                    restrict: 'EA',
                    controller: ["$element", function($element) {
                        this.parentForm = $element.inheritedData('$formController') || nullFormCtrl;
                    }],
                    link: function(scope, element, attrs, ctrl) {
                        scope.$watch(function() {
                            return scope.$eval(attrs.errors);
                        }, function(current, previous) {
                            if (current) {
                                ctrl.errors = current;
                            }
                        });
                    }
                };
            }
        ]);
})();

﻿(function() {
    'use strict';

    angular
        .module('envoc.directives.validation')
        .directive('oValidationMessageFor', ['oValidateConfig',
            function(oValidateConfig) {
                return {
                    restrict: 'EA',
                    require: '^oValidateWith',
                    templateUrl: oValidateConfig.templates.oValidationMessageFor,
                    transclude: true,
                    scope: true,
                    link: function(scope, element, attr, oValidateWithCtrl) {
                        var key = attr.oValidationMessageFor.toLowerCase();
                        var altMessageName = attr.altMessageName;
                        var propertyName = attr.altPropertyName || 'propertyName';

                        scope.$watch(getErrors, function(current, previous) {
                            if (current) {
                                scope.matches = current.filter(function(error) {
                                    error.propertyName = error[propertyName];
                                    return angular.isDefined(error[propertyName]) && error[propertyName].toLowerCase() == key;
                                });

                                if(altMessageName){
                                    scope.matches = scope.matches.map(function(obj, idx){
                                        obj[altMessageName] && (obj.errorMessage = obj[altMessageName]);
                                        return obj;
                                    });
                                }
                            }
                        });

                        function getErrors() { return oValidateWithCtrl.errors; }
                    }
                };
            }
        ]);
})();
(function() {
    'use strict';

    angular
        .module('envoc.directives.validation')
        .directive('oValidationMessageForModelstate', ['oValidateConfig',
            function(oValidateConfig) {
                return {
                    restrict: 'EA',
                    require: '^oValidateWith',
                    templateUrl: oValidateConfig.templates.oValidationMessageForModelstate,
                    transclude: true,
                    scope: true,
                    link: function(scope, element, attr, oValidateWithCtrl) {
                        var key = attr.oValidationMessageForModelstate;

                        scope.$watch(getErrors, function(current, previous) {
                            if (current) {
                                scope.matches = current[key];
                            }
                        });

                        function getErrors() { return oValidateWithCtrl.errors; }
                    }
                };
            }
        ]);
})();
﻿(function() {
    'use strict';

    angular
        .module('envoc.directives.validation')
        .directive('oValidationSummary', ['oValidateConfig',
            function(oValidateConfig) {
                return {
                    restrict: 'EA',
                    require: '^oValidateWith',
                    templateUrl: oValidateConfig.templates.oValidationSummary,
                    transclude: true,
                    scope: true,
                    link: function(scope, element, attr, oValidateWithCtrl) {

                        scope.$watch(getErrors, function(current, previous) {
                            scope.errors = current;
                        });

                        function getErrors() { return oValidateWithCtrl.errors; }
                    }
                };
            }
        ]);
})();
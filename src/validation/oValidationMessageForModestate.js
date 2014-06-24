(function() {
    'use strict';

    angular
        .module('envoc.directives.validation')
        .directive('oValidationMessageForModelstate', [
            function() {
                return {
                    restrict: 'EA',
                    require: '^oValidateWith',
                    templateUrl: '/oTemplates/validation/oValidationMessageForModelstate.tmpl.html',
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
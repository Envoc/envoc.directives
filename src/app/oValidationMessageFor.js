(function() {
    'use strict';

    angular
        .module('envoc.directives')
        .directive('oValidationMessageFor', [
            function() {
                return {
                    restrict: 'EA',
                    require: '^oValidateWith',
                    templateUrl: '/oTemplates/oValidationMessageFor.tmpl.html',
                    transclude: true,
                    scope: true,
                    link: function(scope, element, attr, oValidateWithCtrl) {
                        var key = attr.oValidationMessageFor;
                        scope.errors = oValidateWithCtrl.errors;

                        scope.$watch(getErrors, function(current, previous) {
                            if (current) {
                                scope.matches = current.filter(function(error) {
                                    return error.propertyName == key;
                                });
                            }
                        });

                        function getErrors() { return oValidateWithCtrl.errors; }
                    }
                };
            }
        ]);
})();
(function() {
    'use strict';

    angular
        .module('envoc.directives.validation')
        .directive('oValidationSummary', [
            function() {
                return {
                    restrict: 'EA',
                    require: '^oValidateWith',
                    templateUrl: '/oTemplates/validation/oValidationSummary.tmpl.html',
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
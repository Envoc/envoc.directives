(function() {
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
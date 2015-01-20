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
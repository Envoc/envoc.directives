(function() {
    'use strict';

    angular
        .module('envoc.directives.validation')
        .directive('oValidateWith', [
            function() {
                return {
                    restrict: 'EA',
                    transclude: true,
                    template: '<div ng-transclude><div>',
                    scope: {
                        errors: "="
                    },
                    controller: function() {},
                    link: function(scope, element, attrs, ctrl) {
                        scope.$watch('errors', function(current) {
                            if (current) {
                                ctrl.errors = scope.errors;
                            }
                        });
                    }
                };
            }
        ]);
})();
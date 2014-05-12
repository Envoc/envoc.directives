(function() {
    'use strict';

    angular
        .module('envoc.directives.validation')
        .directive('oValidateWith', [
            function() {
                return {
                    restrict: 'EA',
                    controller: function() {},
                    link: function(scope, element, attrs, ctrl) {
                        scope.$watch(function(){
                            return scope.$eval(attrs.errors);
                        }, function(current) {
                            if (current) {
                                ctrl.errors = scope.$eval(attrs.errors);
                            }
                        });
                    }
                };
            }
        ]);
})();
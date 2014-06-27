(function() {
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
                    controller: function($element) {
                        this.parentForm = $element.inheritedData('$formController') || nullFormCtrl;
                    },
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

(function() {
    'use strict';

    angular
        .module('envoc.directives.validation')
        .directive('oValidationMessageFor', [
            function() {
                return {
                    restrict: 'EA',
                    require: '^oValidateWith',
                    templateUrl: '/oTemplates/validation/oValidationMessageFor.tmpl.html',
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
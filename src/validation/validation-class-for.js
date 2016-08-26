(function () {
    'use strict';

    angular
        .module('envoc')
        .directive('validationClassFor', ['errorService', 'defaultNamespace', function (errorService, defaultNamespace) {
        return {
            restrict: 'A',
            link: function (scope, element, attr){
                var namespace = attr.namespace || defaultNamespace;
                scope.$watch(watchErrors, updateMatches, true);

                function updateMatches(errors) {
                    //if (attr.spotterValidationClassIf.length && !scope.$eval(attr.spotterValidationClassIf)) {
                    //    element.removeClass('has-error');
                    //    return;
                    //}

                    var namespaceErrors = errors[namespace] || {};

                    _.some(namespaceErrors, propertyIsMatch)
                        ? element.addClass('has-error')
                        : element.removeClass('has-error');
                }

                function propertyIsMatch(error) {
                    //This allows for watching multiple properties
                    var propertyNames = attr.validationClassFor.toLowerCase().split(' ');

                    return _.some(propertyNames, function(prop) {
                        return error.propertyName.toLowerCase() == prop.toLowerCase();
                    });
                }

                function watchErrors() {
                    return errorService.errors;
                }
            }
        }
    }]);
})();

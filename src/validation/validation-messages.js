(function () {
    'use strict';
    angular
       .module('envoc')
       .directive('validationMessage', ['errorService', function (errorService) {
           return {
               restrict: 'E',
               scope: { 'for': '@', 'namespace': '@' },
               template: '<div ng-repeat="error in matches" class="alert alert-danger m-t">{{error.errorMessage}}</div>\n',
               bindToController: true,
               controllerAs: 'validateCtrl',
               controller: ['$scope', 'defaultNamespace', function ($scope, defaultNamespace) {
                   var vm = this;
                   vm.namespace = vm.namespace || defaultNamespace;
                   $scope.$watch(watchErrors, updateMatches, true);

                   function updateMatches(errors) {
                       var namespaceErrors = errors[vm.namespace] || {};
                       $scope.matches = _.filter(namespaceErrors, propertyIsMatch);
                   }

                   function propertyIsMatch(error) {
                       if (typeof vm.for !== 'undefined') {
                           return error.propertyName.toLowerCase() == vm.for.toLowerCase();
                       }
                       return true;
                   }

                   function watchErrors() {
                       return errorService.errors;
                   }
               }]
           };
       }]);
})();
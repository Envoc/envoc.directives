(function() {
    'use strict';

    var app = angular.module('envoc.directives.datatables');

    app.directive('oTableRepeat', function() {
        return {
            restrict: 'A',
            scope: true,
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                scope.ctrl = controller;
            }
        };
    });    
    
})();

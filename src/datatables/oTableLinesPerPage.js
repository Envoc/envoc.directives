(function() {
    'use strict';

    var app = angular.module('envoc.directives.datatables');

    app.directive('oTableLinesPerPage', function() {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: '/oTemplates/datatables/oTableLinesPerPage.tmpl.html',
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                scope.ctrl = controller;
            }
        };
    });
    
})();
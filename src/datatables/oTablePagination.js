(function() {
    'use strict';

    var app = angular.module('envoc.directives.datatables');

    app.directive('oTablePagination', function() {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: '/oTemplates/datatables/oTablePagination.tmpl.html',
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                scope.ctrl = controller;

                scope.ctrl.paginationSettings = angular.extend({
                    maxSize: 5,
                    previousText: 'Previous',
                    nextText: 'Next',
                    directionLinks: true,
                    rotate: true
                }, scope.ctrl.paginationSettings);
            }
        };
    });
    
})();

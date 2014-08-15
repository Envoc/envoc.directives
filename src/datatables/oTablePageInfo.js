angular.module('envoc.directives.datatables')
    .directive('oTablePageInfo', function() {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: '/oTemplates/datatables/oTablePageInfo.tmpl.html',
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                scope.ctrl = controller;
            }
        };
    });
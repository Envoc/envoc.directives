angular.module('envoc')
    .directive('oTableDefault', function() {
        return {
            templateUrl: '/oTemplates/datatables/oTableDefault.tmpl.html',
            require: '^oTable',
            restrict: 'EA',
            transclude: true,
            scope: {},
            compile: function compile(tElement, tAttrs, transclude) {
                return function postLink(scope, iElement, iAttrs, controller) {
                    ctor();
                    function ctor() {
                        scope.ctrl = controller;
                        scope.$watch(getOTableData, applyToScope);
                        iElement.find('table').addClass('table table-striped dataTable');
                    }

                    function getOTableData() {
                        return controller.data;
                    }

                    function applyToScope(current, previous, scope) {
                        if (current && current.length) {
                            scope.rows = current;
                        }
                    }
                }
            }
        };
    });
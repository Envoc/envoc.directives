(function() {
    'use strict';

    angular
        .module('envoc.directives.datatables')
        .directive('oTableDefault', function() {
            return {
                templateUrl: '/oTemplates/datatables/oTableDefault.tmpl.html',
                require: '^oTable',
                restrict: 'EA',
                scope: {},
                compile: function compile(tElement, tAttrs, transclude) {
                    if(!tAttrs.fields){
                        throw new Error('No filed list included')
                    }

                    var theBodyRow = tElement.find('tbody').find('tr');
                    var theHeadRow = tElement.find('thead').find('tr');

                    var theFields = tAttrs.fields.split(',');

                    buildTemplate(theHeadRow, '<td>', '</td>', theFields);

                    buildTemplate(theBodyRow, '<td>{{row.', '}}</td>', theFields);

                    function buildTemplate(theRow, startTemplate, endTemplate, fields) {
                        var fieldTemplate = startTemplate + fields.join(endTemplate + startTemplate) + endTemplate;

                        theRow.html(fieldTemplate);
                    }

                    return function postLink(scope, iElement, iAttrs, controller) {

                        ctor();
                        function ctor() {
                            scope.$watch(getOTableData, applyToScope);
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
})();

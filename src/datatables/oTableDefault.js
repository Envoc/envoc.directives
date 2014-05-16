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
                    if(!tAttrs.fields) {
                        throw new Error('No field list included');
                    }

                    var theBodyRow = tElement.find('tbody').find('tr');
                    var theHeadRow = tElement.find('thead').find('tr');

                    var theFields = tAttrs.fields.split(',');
                    
                    var sortable = (tAttrs.sortable || '').split(',');

                    var headerHtml = '';
                    angular.forEach(theFields, function(val){
                        var sortTemplate = '<span class="pull-right"><span class="asc">asc</span><span class="desc">desc</span></span>'
                        var found = sortable.indexOf(val) > -1;
                        var header = found ? sortTemplate : '';
                        var headerAttr = found ? 'o-table-sort field="' + val + '"' : '';
                        var html =  '<th ' + headerAttr + '>' + 
                                        val +
                                        header +
                                    '</th>'
                        headerHtml = headerHtml + html;
                    });

                    theHeadRow.html(headerHtml)

                    buildTemplate(theBodyRow, '<td>{{row.', '}}</td>', theFields);

                    function buildTemplate(theRow, startTemplate, endTemplate, fields) {
                        var fieldTemplate = startTemplate + fields.join(endTemplate + startTemplate) + endTemplate;

                        theRow.html(fieldTemplate);
                    }

                    return function postLink(scope, iElement, iAttrs, controller) {
                        ctor();
                        function ctor() {
                            scope.ctrl = controller;
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

(function() {
    'use strict';

    angular
        .module('envoc.directives.datatables')
        .controller('oTableCtrl', function($http) {
            var config,
                self = this;

            this.init = function(config_) {
                config = config_;
                if (!config.dataSrcUrl && !config.dataSrc) {
                    throw new Error('A data source is required')
                }

                config.dataSrcUrl ? this.fetch() : (this.data = config.dataSrc);
            }

            this.fetch = function() {
                $http
                    .post(config.dataSrcUrl)
                    .then(dataFetchSuccess, dataFetchError);

                function dataFetchSuccess(resp) {
                    self.data = resp.data
                }

                function dataFetchError() {
                    alert('Error fetching data');
                }
            }
        })
        .directive('oTable', function() {
            return {
                priority: 800,
                restrict: 'EA',
                scope: {
                    config: '='
                },
                controller: 'oTableCtrl',
                controllerAs: 'oTableCtrl',
                compile: function compile(tElement, tAttrs, transclude) {
                    return function postLink(scope, iElement, iAttrs, controller) {
                        controller.init(scope.config);
                    }
                }
            };
        })
        .directive('oTableDefault', function() {
            return {
                templateUrl: '/oTemplates/datatables/oTableDefault.tmpl.html',
                require: '^oTable',
                restrict: 'EA',
                scope: {},
                compile: function compile(tElement, tAttrs, transclude) {
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

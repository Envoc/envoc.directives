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
                    throw new Error('A data source is required');
                }

                config.dataSrcUrl ? this.fetch() : (this.data = config.dataSrc);
            }

            this.fetch = function() {
                $http
                    .post(config.dataSrcUrl)
                    .then(dataFetchSuccess, dataFetchError);

                function dataFetchSuccess(resp) {
                    self.data = resp.data;
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
        });
})();

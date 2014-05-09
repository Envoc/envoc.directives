(function() {
    'use strict';

    angular
        .module('envoc.directives.datatables')
        .controller('oTableController', function($http) {
            var config,
                self = this;

            this.init = function(config_){
                config = config_;
                if(!config_.dataSrcUrl){
                    throw new Error('A data source is required')
                }

                this.fetch();
            }

            this.fetch = function(){
                $http
                    .post(config.dataSrcUrl)
                    .then(dataFetchSuccess, dataFetchError);

                function dataFetchSuccess(resp){
                    self.data = resp.data;
                }

                function dataFetchError(){
                    alert('Error fetching data');
                }
            }
        })
        .directive('oTable', function() {
            return {
                template: '<div ng-transclude></div>',
                transclude: true,
                restrict: 'EA',
                scope: {
                    config: '='
                },
                controller: 'oTableController',
                compile: function compile(tElement, tAttrs, transclude) {
                    return function postLink(scope, iElement, iAttrs, controller) {
                        controller.init(scope.config);
                    }
                }
            };
        })
})();

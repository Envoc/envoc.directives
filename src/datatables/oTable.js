(function() {
    'use strict';

    angular
        .module('envoc.directives.datatables')
        .filter('startFrom', function() {
            return function(input, start) {
                if (input === undefined) {
                    return input;
                } else {
                    return input.slice(+start);
                }
            };
        })
        .controller('oTableCtrl', function($scope, $http, $filter) {
            var config,
                dataCache = [],
                self = this,
                limitTo = $filter('limitTo'),
                filter = $filter('filter'),
                startFrom = $filter('startFrom');

            this.state = {
                currentPage: 1,
                linesPerPage: 10,
                iTotalRecords: 0,
                iTotalDisplayRecords: 0,
                allSearch: ''
            };

            this.events = {};

            this.init = function(config_) {
                config = config_;
                if (!config.dataSrcUrl && !config.dataSrc) {
                    throw new Error('A data source is required');
                }

                if (config.dataSrcUrl) {
                    this.fetch()
                } else {
                    initClientSide();
                }
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

            function initClientSide(){
                dataCache = config.dataSrc;
                self.state.iTotalRecords = self.state.iTotalDisplayRecords = config.dataSrc.length;
                calculateVisible();
                setupWatches();
            }

            function calculateVisible(){
                var clone = angular.copy(dataCache);

                if(self.state.allSearch){
                    clone = filter(clone, self.state.allSearch);
                    self.state.iTotalDisplayRecords = clone.length;
                } else {
                    self.state.iTotalDisplayRecords = dataCache.length;
                }

                self.state.pageStartIdx = (self.state.currentPage - 1) * self.state.linesPerPage;
                
                // handle going off the page
                while (self.state.pageStartIdx > clone.length){
                    self.state.currentPage--;
                    self.state.pageStartIdx = (self.state.currentPage - 1) * self.state.linesPerPage;
                }

                self.data = limitTo(startFrom(clone, self.state.pageStartIdx), self.state.linesPerPage);
                self.state.pageStopIdx = self.state.pageStartIdx + self.data.length
            }

            function setupWatches(){
                $scope.$watch(watchCurrentPage, calculateVisible);
                $scope.$watch(watchLinesPerPage, calculateVisible);
                $scope.$watch(watchAllSearch, calculateVisible);
            }

            function watchCurrentPage(){
                return self.state.currentPage;
            }

            function watchLinesPerPage(){
                return self.state.linesPerPage;
            }

            function watchAllSearch(){
                return self.state.allSearch;
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

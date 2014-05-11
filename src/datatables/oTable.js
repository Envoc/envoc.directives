(function() {
    'use strict';

    var app = angular.module('envoc.directives.datatables');

    app.filter('startFrom', function() {
        return function(input, start) {
            if (input === undefined) {
                return input;
            } else {
                return input.slice(+start);
            }
        };
    });
    
    app.controller('oTableCtrl', function($scope, $http, $filter) {
        var self = this,
            config = {
                fetchMethod: defaultFetch
            },
            dataCache = [],
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

        this.init = function(config_) {
            angular.extend(config, config_);

            if (!config.dataSrcUrl && !config.dataSrc && !config.fetchMethod) {
                throw new Error('A data source is required');
            }

            if (config.dataSrc) {
                initClientSide();
            } else {
                this.fetch();
            }
        }

        this.fetch = function() {
            config
                .fetchMethod()
                .then(dataFetchSuccess, dataFetchError);
        }

        // =================================
        //          DATA-BINDING
        // =================================

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

        // =================================
        //          LOCAL DATA
        // =================================

        function initClientSide(){
            dataCache = config.dataSrc;
            self.state.iTotalRecords = self.state.iTotalDisplayRecords = config.dataSrc.length;
            calculateVisible();
            setupWatches();
        }

        // =================================
        //          REMOTE DATA
        // =================================

        function defaultFetch(){
            return $http.post(config.dataSrcUrl)
        }

        function transposeDataSet(response){
            var columnArray = response.sColumns.split(',');
            var transposed = response.aaData.map(convertArrayToObject);

            return transposed;

            function convertArrayToObject(valueArray){
                var obj = {};
                
                columnArray.forEach(mapKeyToIndex);

                return obj;

                function mapKeyToIndex(key, idx){
                    obj[key] = valueArray[idx];
                }
            }
        }

        function dataFetchSuccess(resp) {
            self.data = dataCache = transposeDataSet(resp.data);
            calculateVisible();
        }

        function dataFetchError() {
            alert('Error fetching data');
        }

        // =================================
        //          WATCHES
        // =================================

        function setupWatches(){
            $scope.$watch(watchCurrentPage, calculateVisible);
            $scope.$watch(watchLinesPerPage, calculateVisible);
            $scope.$watch(watchAllSearch, calculateVisible);

            $scope.$watchCollection(watchClientDataSrc, calculateVisible);
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

        function watchClientDataSrc(){
            return dataCache;
        }
    });
    
    app.directive('oTable', function() {
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

    app.directive('oTableFilter', function() {
        return {
            restrict: 'A',
            scope: true,
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                iElement.on('keyup', setAllSearch)
                
                function setAllSearch(){
                    scope.$evalAsync(function(){
                        controller.state.allSearch = iElement.val();
                    });
                }
            }
        };
    });
})();

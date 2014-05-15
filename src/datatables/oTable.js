(function() {
    'use strict';

    var app = angular.module('envoc.directives.datatables');

    app.controller('oTableCtrl', function($scope, $http, $filter, $timeout) {
        var self = this,
            dataCache = [],
            limitTo,
            filter,
            startFrom,
            config = {
                fetchMethod: null,
                linesPerPage: 10,
                throttle: 0
            };

        this.init = function(config_) {
            angular.extend(config, config_);

            if (!config.dataSrcUrl && !config.dataSrc && !config.fetchMethod) {
                throw new Error('A data source is required');
            }

            config.dataSrcUrl && (config.fetchMethod = defaultFetch);

            this.state = {
                currentPage: 1,
                linesPerPage: config.linesPerPage,
                iTotalRecords: 0,
                iTotalDisplayRecords: 0,
                allSearch: ''
            };

            if (config.dataSrc) {
                initClientSide();
            } else {
                initRemoteData();
            }
        }

        this.fetch = function() {
            var request = createDatatableRequest();

            if(config.fetchMethod.last && angular.toJson(request) == config.fetchMethod.last)
                return;

            config
                .fetchMethod(request)
                .then(dataFetchSuccess, dataFetchError);

            config.fetchMethod.last = angular.toJson(request);
        }

        // =================================
        //          DATA-BINDING
        // =================================

        function calculateVisible() {
            var clone = angular.copy(dataCache);

            if (self.state.allSearch) {
                clone = filter(clone, self.state.allSearch);
                self.state.iTotalDisplayRecords = clone.length;
            } else {
                self.state.iTotalDisplayRecords = dataCache.length;
            }

            self.state.iTotalRecords = dataCache.length;
            self.state.pageStartIdx = (self.state.currentPage - 1) * self.state.linesPerPage;

            // handle going off the page
            while (self.state.pageStartIdx > clone.length) {
                self.state.currentPage--;
                calcPageStart()
            }

            self.data = limitTo(startFrom(clone, self.state.pageStartIdx), self.state.linesPerPage);
            calcPageStop();
        }

        // =================================
        //          LOCAL DATA
        // =================================

        function initClientSide() {
            limitTo = $filter('limitTo');
            filter = $filter('filter');
            startFrom = $filter('startFrom');

            dataCache = config.dataSrc;
            calculateVisible();
            setupClientWatches();
        }

        // =================================
        //          REMOTE DATA
        // =================================

        function initRemoteData() {
            setupRemoteWatches();
        }

        function defaultFetch() {
            return $http.post(config.dataSrcUrl)
        }

        function createDatatableRequest() {
            var s = self.state;

            return {
                Skip: (s.currentPage - 1) * s.linesPerPage, // 0
                Take: s.linesPerPage, //10
                AllSearch: s.allSearch
            }
        }

        function transposeDataSet(response) {
            var columnArray = response.sColumns.split(',');
            var transposed = response.aaData.map(convertArrayToObject);

            return transposed;

            function convertArrayToObject(valueArray) {
                var obj = {};

                columnArray.forEach(mapKeyToIndex);

                return obj;

                function mapKeyToIndex(key, idx) {
                    obj[key] = valueArray[idx];
                }
            }
        }

        function dataFetchSuccess(resp) {
            self.data = dataCache = transposeDataSet(resp.data);
            self.state.iTotalRecords = resp.data.iTotalRecords;
            self.state.iTotalDisplayRecords = resp.data.iTotalDisplayRecords;
            calcPageStart();
            calcPageStop();
        }

        function dataFetchError() {
            alert('Error fetching data');
        }

        // =================================
        //          WATCHES
        // =================================

        function setupClientWatches() {
            $scope.$watch(watchCurrentPage, calculateVisible);
            $scope.$watch(watchLinesPerPage, calculateVisible);
            $scope.$watch(watchAllSearch, calculateVisible);

            $scope.$watchCollection(watchClientDataSrc, calculateVisible);
        }

        function setupRemoteWatches() {
            config.throttle > 300 && (self.fetch = throttle(self.fetch, config.throttle));
            $scope.$watch(createDatatableRequest, self.fetch, true);
        }

        function watchCurrentPage() {
            return self.state.currentPage;
        }

        function watchLinesPerPage() {
            return self.state.linesPerPage;
        }

        function watchAllSearch() {
            return self.state.allSearch;
        }

        function watchClientDataSrc() {
            return dataCache;
        }

        // =================================
        //          STATE MANAGEMENT
        // =================================

        function calcPageStart() {
            self.state.pageStartIdx = (self.state.currentPage - 1) * self.state.linesPerPage;
        }

        function calcPageStop() {
            self.state.pageStopIdx = self.state.pageStartIdx + self.data.length;
        }

        // =================================
        //          UTILITIES
        // =================================

        function throttle(fn, threshhold, scope) {
            threshhold || (threshhold = 250);
            var last,
                deferTimer;
            return function() {
                var context = scope || this;

                var now = +new Date,
                    args = arguments;
                if (last && now < last + threshhold) {
                    // hold on to it
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function() {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        }
    });

    app.directive('oTable', function() {
        return {
            priority: 800,
            restrict: 'EA',
            scope: {
                config: '=',
                state: '='
            },
            controller: 'oTableCtrl',
            controllerAs: 'oTableCtrl',
            compile: function compile(tElement, tAttrs, transclude) {
                return function postLink(scope, iElement, iAttrs, controller) {
                    controller.init(scope.config);
                    (scope.state && (scope.state = controller.state));

                    iElement.addClass('o-table');
                }
            }
        };
    });
})();

angular.module('envoc.directives.datatables')
    .controller('oTableCtrl', function($scope, $http, $filter, $rootScope,$timeout) {
        var self = this,
            dataCache = [],
            // filters
            limitTo,
            filter,
            startFrom,
            orderBy,
            // config
            config = {
                fetchMethod: null,
                linesPerPage: 10,
                throttle: 0,
                defaultSort: []
            };

        this.api = {
            refresh: function(){
                self.fetch(true);
            }
        }

        this.init = function(config_) {
            angular.extend(config, config_);

            self.paginationSettings = config_.paginationSettings || {};

            if (!config.dataSrcUrl && !config.dataSrc && !config.fetchMethod) {
                throw new Error('A data source is required');
            }

            config.dataSrcUrl && (config.fetchMethod = defaultFetch);

            this.state = {
                currentPage: 1,
                linesPerPage: config.linesPerPage,
                iTotalRecords: 0,
                iTotalDisplayRecords: 0,
                allSearch: '',
                sortObj: {},
                sortOrder: [],
                searchObj: {}
            };

            if (config.dataSrc) {
                initClientSide();
            } else {
                initRemoteData();
            }
        }

        this.fetch = function (forceRefresh) {
            var request = createDatatableRequest();
            if(config.getAdditionalParams){
                request = angular.extend(request, config.getAdditionalParams());
            }

            if(!forceRefresh & config.fetchMethod.last && angular.toJson(request) == config.fetchMethod.last)
                return;

            self.loading = null;

            $timeout(function () {
                if (self.loading == null) {
                    self.loading = true;
                }
            }, 500);

            config
                .fetchMethod(request)
                .then(dataFetchSuccess, dataFetchError);

            config.fetchMethod.last = angular.toJson(request);
        }

        this.sortOn = function(shiftKey, propertyName){
            var last = self.state.lastSortShifted;

            var val = self.state.sortObj[propertyName];
            var next = angular.isDefined(val) ? !self.state.sortObj[propertyName] : true;

            if(!shiftKey) {
                self.state.sortObj = {}
                self.state.sortOrder.length = 0;
            }

            var hasKey = self.state.sortOrder.indexOf(propertyName) > -1;
            if(!hasKey) {
                self.state.sortOrder.push(propertyName);
            }
            
            self.state.sortObj[propertyName] = next;
            self.state.lastSortShifted = shiftKey;
            $rootScope.$broadcast('oTable::sorting');
        };

        this.columnFilter = function(searchTerm, propertyName){
            var propertyIndex = config.propertyMap[propertyName];
            self.state.searchObj[propertyName] = searchTerm;
            if(!searchTerm){
                delete self.state.searchObj[propertyName];
            }
            $rootScope.$broadcast('oTable::filtering');
        };

        this.getSortingPropertyInfo = function(propertyName){
            return {
                sorting: isSortingProperty(propertyName),
                direction: getSortDirection(propertyName)
            }
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

            var isSorting = self.state.sortOrder.length > 0;

            if(isSorting){
                var sortProperty = self.state.sortOrder[0];
                var sortDirectionPrefix = self.state.sortObj[sortProperty] ? '+' : '-';
                var sortExpression = sortDirectionPrefix + sortProperty;
                clone = orderBy(clone, sortExpression);
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
            orderBy = $filter('orderBy');

            dataCache = config.dataSrc;
            calculateVisible();
            setupClientWatches();

            $rootScope.$on('oTable::sorting', calculateVisible);
            $rootScope.$on('oTable::filtering', calculateVisible);
        }

        // =================================
        //          REMOTE DATA
        // =================================

        function initRemoteData() {
            setupRemoteWatches();
            $rootScope.$on('oTable::filtering', self.fetch);
            // $rootScope.$on('oTable::sorting', self.fetch);
        }

        function defaultFetch(request) {
            return $http.post(config.dataSrcUrl, request)
        }

        function mapDefaultSort(){
            return config.defaultSort.map(function(val, idx){
                return {
                    ColumnIndex: val[0],
                    SortDirection: val[1],
                    SearchTerm: (val[2] || null)
                };
            });
        }

        function createDatatableRequest() {
            var s = self.state;
            var filterKeys = angular.extend({}, s.searchObj, s.sortObj);
            var params = {
                Skip: (s.currentPage - 1) * s.linesPerPage, // 0
                Take: s.linesPerPage, //10
                AllSearch: s.allSearch
            };

            params.Columns = [];

            angular.forEach(filterKeys, function(propertyValue, propertyName){
                var direction = angular.isDefined(s.sortObj[propertyName]) ? getSortDirection(propertyName) : null;
                var searchTerm = s.searchObj[propertyName] || null;
                var propertyIndex = config.propertyMap[propertyName];
                
                if(direction || searchTerm){
                    params.Columns.push({
                        ColumnIndex: propertyIndex,
                        SortDirection: direction,
                        SearchTerm: searchTerm
                    });
                }
            });

            if(config.defaultSort.length && !self.state.sortOrder.length){
                params.Columns = Array.prototype.concat.apply(params.Columns, mapDefaultSort());
            }

            return params
        }

        function isSortingProperty(propertyName){
            return self.state.sortOrder.indexOf(propertyName) > -1;
        }

        function getSortDirection(propertyName){
            var direction = '';

            if(isSortingProperty(propertyName)){
                direction = self.state.sortObj[propertyName] ? 'asc' : 'desc';
            }

            return direction;
        }

        function transposeDataSet(response) {
            config.propertyMap = {};

            var columnArray = response.sColumns.split(',');
            var transposed = response.aaData.map(convertArrayToObject);

            return transposed;

            function convertArrayToObject(valueArray) {
                var obj = {};
                columnArray.forEach(mapKeyToIndex);

                return obj;

                function mapKeyToIndex(key, idx) {
                    obj[key] = valueArray[idx];
                    config.propertyMap[key] = idx;
                }
            }
        }

        function dataFetchSuccess(resp) {
            self.data = dataCache = transposeDataSet(resp.data);
            self.state.iTotalRecords = resp.data.iTotalRecords;
            self.state.iTotalDisplayRecords = resp.data.iTotalDisplayRecords;
            calcPageStart();
            calcPageStop();
            self.loading = false;
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
    })
    .directive('oTable', function() {
        return {
            priority: 800,
            restrict: 'EA',
            scope: {
                config: '=',
                state: '=',
                api: '='
            },
            controller: 'oTableCtrl',
            controllerAs: 'oTableCtrl',
            compile: function compile(tElement, tAttrs, transclude) {
                return function postLink(scope, iElement, iAttrs, controller) {
                    controller.init(scope.config);
                    (scope.state && (scope.state = controller.state));
                    (iAttrs.api && (scope.api = controller.api));

                    iElement.addClass('o-table');
                }
            }
        };
    })
    .directive('oTableController', function() {
        return {
            restrict: 'A',
            priority:1000,
            scope: true,
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                var ctrlName = iAttrs.exposeAs || 'ctrl';
                scope[ctrlName] = controller;
            }
        };
    });
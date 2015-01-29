angular.module('envoc.directives.datatables')
  .provider('oTableConfig', function() {
    var config = {
      templates: {
        oTableLinesPerPageUrl: '/oTemplates/datatables/oTableLinesPerPage.tmpl.html',
        oTablePageInfoUrl: '/oTemplates/datatables/oTablePageInfo.tmpl.html',
        oTablePaginationUrl: '/oTemplates/datatables/oTablePagination.tmpl.html'
      },
      i18n: {
        en: {
          show: 'Show',
          entries: 'entries',
          filteredFrom: 'filtered from',
          search: 'Search',
          loading: 'Loading...',
          noData: 'No data found...',
          of: 'of',
          nextText: 'Next',
          previousText: 'Previous'
        }
      }
    };
    return {
      config: config,
      addLangConfig: function addLangConfig(key, langConfig){
        config.i18n[key] = langConfig;
      },
      $get: function() {
        return config;
      }
    }
  })
  .controller('oTableCtrl', function($scope, $http, $filter, $rootScope, $timeout, oTableConfig) {
    var self      = this;
    var dataCache = [];

    var config    = {
      fetchMethod: null,
      linesPerPage: 10,
      throttle: 0,
      defaultSort: []
    };

    var limitTo, filter, startFrom, orderBy; // filters

    self.init                   = init;
    self.fetch                  = fetch;
    self.sortOn                 = sortOn;
    self.columnFilter           = columnFilter;
    self.getSortingPropertyInfo = getSortingPropertyInfo;
    self.api                    = {
      refresh: refresh,
      setLang: setLang
    }

    // =================================
    //          PUBLIC API
    // =================================

    function init(config_) {
      var lang = config_.lang || 'en';
      self.lang = oTableConfig.i18n[lang];
      angular.extend(config, config_);

      self.paginationSettings = config_.paginationSettings || self.lang;

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

      try {
        var saved;
        if (config.saveState) {
          saved = angular.fromJson(localStorage.getItem(config.saveState));
          if (saved) {
            angular.extend(this.state, saved);
            $timeout(function() {
              $rootScope.$broadcast('oTable::internalStateChanged');
            });
          }
        }
      } catch (e) {
        console.log('unable to use saved state');
      }


      if (config.dataSrc) {
        initClientSide();
      } else {
        initRemoteData();
      }
    }

    function fetch(forceRefresh) {
      if (self.waitForInitialSaveStateLoad)
        return;

      if (!self.fetch.called && config.saveState)
        self.waitForInitialSaveStateLoad = angular.fromJson(localStorage.getItem(config.saveState));

      var request = createDatatableRequest();
      if (config.getAdditionalParams) {
        request = angular.extend(request, config.getAdditionalParams());
      }

      forceRefresh = typeof forceRefresh == 'boolean' && forceRefresh;
      if (!forceRefresh && config.fetchMethod.last && angular.toJson(request) == config.fetchMethod.last)
        return;

      self.loading = null;

      $timeout(function() {
        if (self.loading == null) {
          self.loading = true;
        }
      }, 500);

      config
        .fetchMethod(request)
        .then(dataFetchSuccess, dataFetchError);

      config.fetchMethod.last = angular.toJson(request);
      self.fetch.called = true;
    }

    function sortOn(shiftKey, propertyName) {
      var last = self.state.lastSortShifted;

      var val = self.state.sortObj[propertyName];
      var next = angular.isDefined(val) ? !self.state.sortObj[propertyName] : true;

      if (!shiftKey) {
        self.state.sortObj = {}
        self.state.sortOrder.length = 0;
      }

      var hasKey = self.state.sortOrder.indexOf(propertyName) > -1;
      if (!hasKey) {
        self.state.sortOrder.push(propertyName);
      }

      self.state.sortObj[propertyName] = next;
      self.state.lastSortShifted = shiftKey;
      $rootScope.$broadcast('oTable::sorting');
    };

    function columnFilter(searchTerm, propertyName) {
      var propertyIndex = config.propertyMap[propertyName];
      self.state.searchObj[propertyName] = searchTerm;
      if (!searchTerm) {
        delete self.state.searchObj[propertyName];
      }
      $rootScope.$broadcast('oTable::filtering');
    };

    function getSortingPropertyInfo(propertyName) {
      return {
        sorting: isSortingProperty(propertyName),
        direction: getSortDirection(propertyName)
      }
    }

    function setLang(key){
      self.lang = oTableConfig.i18n[key];
    }

    function refresh() {
      self.fetch(true);
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

      if (isSorting) {
        var sortProperty = self.state.sortOrder[0];
        var sortDirectionPrefix = self.state.sortObj[sortProperty] ? '+' : '-';
        var sortExpression = sortDirectionPrefix + sortProperty;
        clone = orderBy(clone, sortExpression);
      }

      self.state.iTotalRecords = dataCache.length;
      self.state.pageStartIdx = (self.state.currentPage - 1) * self.state.linesPerPage;
      if(self.state.pageStartIdx < 0)
        self.state.pageStartIdx = 0;

      // handle going off the page
      while (clone.length && self.state.pageStartIdx >= clone.length) {
        self.state.currentPage--;
        calcPageStart();
      }

      self.data = limitTo(startFrom(clone, self.state.pageStartIdx), self.state.linesPerPage);
      calcPageStop();

      if (config.saveState)
        updateSavedState();
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

    function mapDefaultSort() {
      return config.defaultSort.map(function(val, idx) {
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

      angular.forEach(filterKeys, function(propertyValue, propertyName) {
        var direction = angular.isDefined(s.sortObj[propertyName]) ? getSortDirection(propertyName) : null;
        var searchTerm = s.searchObj[propertyName] || null;
        var propertyIndex = config.propertyMap[propertyName];

        if (direction || searchTerm) {
          params.Columns.push({
            ColumnIndex: propertyIndex,
            SortDirection: direction,
            SearchTerm: searchTerm
          });
        }
      });

      if (config.defaultSort.length && !self.state.sortOrder.length) {
        params.Columns = Array.prototype.concat.apply(params.Columns, mapDefaultSort());
      }
      return params;
    }

    function isSortingProperty(propertyName) {
      return self.state.sortOrder.indexOf(propertyName) > -1;
    }

    function getSortDirection(propertyName) {
      var direction = '';

      if (isSortingProperty(propertyName)) {
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

      if (config.saveState) {
        if (self.waitForInitialSaveStateLoad)
          self.state = defaultsShallow(self.state, self.waitForInitialSaveStateLoad);
        updateSavedState();
      }

      self.waitForInitialSaveStateLoad = false;
    }

    function dataFetchError() {
      self.waitForInitialSaveStateLoad = false;
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

    function updateSavedState() {
      var savedSettings = {
        time: +new Date(),
        allSearch: "",
        currentPage: 1,
        linesPerPage: config.linesPerPage
      };

      savedSettings = defaultsShallow(savedSettings, self.state);
      try {
        localStorage.setItem(config.saveState, angular.toJson(savedSettings));
      } catch (e) {}
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

    function defaultsShallow(obj) {
      var keys = Object.keys(obj),
        defaultObjects = Array.prototype.slice.call(arguments, 1),
        result = {};

      defaultObjects.unshift({});

      var merged = angular.extend.apply({}, defaultObjects);

      angular.forEach(keys, function(val, idx) {
        if (angular.isDefined(merged[val]))
          result[val] = merged[val];
        else
          result[val] = obj[val];
      });

      return result;
    }
  })
  .directive('oTable', function() {
    return {
      priority: 800,
      restrict: 'EA',
      scope: {
        config: '=',
        state: '=',
        exposeApiAs: '='
      },
      controller: 'oTableCtrl',
      controllerAs: 'oTableCtrl',
      compile: function compile(tElement, tAttrs, transclude) {
        return function postLink(scope, iElement, iAttrs, controller) {
          controller.init(scope.config);
          (scope.state && (scope.state = controller.state));
          (iAttrs.exposeApiAs && (scope.exposeApiAs = controller.api));

          iElement.addClass('o-table');
        }
      }
    };
  })
  .directive('oTableController', function() {
    return {
      restrict: 'A',
      priority: 1000,
      scope: true,
      require: '^oTable',
      link: function postLink(scope, iElement, iAttrs, controller) {
        var ctrlName = iAttrs.exposeAs || 'ctrl';
        scope[ctrlName] = controller;
      }
    };
  });

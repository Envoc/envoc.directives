/*
 * envoc.directives 0.12.0
 * Author: Envoc
 * Repository: https://github.com/Envoc/envoc.directives
 */
(function() {
    'use strict';

    angular.module('envoc', ['ui.bootstrap.pagination'])
    	.value('defaultNamespace', 'root')
        .value('namespacePropName', '__namespace')
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('errorNamespacingHttpInterceptor');
            $httpProvider.interceptors.push('noCacheInterceptor');
        }]);
})();
angular.module('ui.bootstrap.pagination', [])

.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function() {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function() {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function(page) {
    if ( $scope.page !== page && page > 0 && page <= $scope.totalPages) {
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function( key ) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };
  $scope.noPrevious = function() {
    return $scope.page === 1;
  };
  $scope.noNext = function() {
    return $scope.page === $scope.totalPages;
  };

  $scope.$watch('totalItems', function() {
    $scope.totalPages = self.calculateTotalPages();
  });

  $scope.$watch('totalPages', function(value) {
    setNumPages($scope.$parent, value); // Readonly variable

    if ( $scope.page > value ) {
      $scope.selectPage(value);
    } else {
      ngModelCtrl.$render();
    }
  });
}])

.constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
})

.directive('pagination', ['$parse', 'paginationConfig', function($parse, paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@'
    },
    require: ['pagination', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pagination.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

      paginationCtrl.init(ngModelCtrl, paginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

        // recompute if maxSize
        if ( isMaxSized ) {
          if ( rotate ) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if ( isMaxSized && ! rotate ) {
          if ( startPage > 1 ) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if ( endPage < totalPages ) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function() {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}])

.constant('pagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('pager', ['pagerConfig', function(pagerConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@'
    },
    require: ['pager', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pager.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
      paginationCtrl.init(ngModelCtrl, pagerConfig);
    }
  };
}]);

(function(module) {
try {
  module = angular.module('envoc');
} catch (e) {
  module = angular.module('envoc', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/datatables/oTableDefault.tmpl.html',
    '<div class="dataTables_wrapper form-inline" role="grid" ng-cloak>\n' +
    '    <div class="row">\n' +
    '        <div class="span6 pull-left">\n' +
    '            <div class="dataTables_length">\n' +
    '                <div o-table-lines-per-page></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="span6 pull-right">\n' +
    '            <div class="dataTables_filter">\n' +
    '                <label>\n' +
    '                    {{ctrl.lang.search}}:\n' +
    '                    <input type="text" o-table-filter>\n' +
    '                </label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    \n' +
    '    <div class="alert alert-info" ng-show="ctrl.loading">\n' +
    '        <strong>{{ctrl.lang.loading}}</strong>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="alert alert-info" ng-hide="ctrl.data.length || ctrl.loading">\n' +
    '        <strong>{{ctrl.lang.noData}}</strong>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-transclude></div>\n' +
    '\n' +
    '    <div class="row" ng-show="ctrl.data.length">\n' +
    '        <div class="span6 pull-left">\n' +
    '            <div o-table-page-info></div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="span6 pull-right">\n' +
    '            <div class="dataTables_paginate paging_bootstrap">\n' +
    '                <div o-table-pagination></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('envoc');
} catch (e) {
  module = angular.module('envoc', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/datatables/oTableLinesPerPage.tmpl.html',
    '<label>\n' +
    '    {{ctrl.lang.show}}\n' +
    '    <select ng-model="ctrl.state.linesPerPage" ng-options="o for o in ctrl.linesPerPageOptions">\n' +
    '    </select>\n' +
    '    {{ctrl.lang.entries}}\n' +
    '</label>');
}]);
})();

(function(module) {
try {
  module = angular.module('envoc');
} catch (e) {
  module = angular.module('envoc', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/datatables/oTablePageInfo.tmpl.html',
    '<span class="dataTables_info" ng-show="ctrl.data.length">\n' +
    '    {{ctrl.state.pageStartIdx + 1}} - {{ctrl.state.pageStopIdx}}\n' +
    '    {{ctrl.lang.of}} {{ctrl.state.iTotalDisplayRecords}}\n' +
    '    {{ctrl.lang.entries}}\n' +
    '    <span ng-show="ctrl.state.iTotalRecords !== ctrl.state.iTotalDisplayRecords">\n' +
    '        ({{ctrl.lang.filteredFrom}} {{ctrl.state.iTotalRecords}})\n' +
    '    </span>\n' +
    '</span>');
}]);
})();

(function(module) {
try {
  module = angular.module('envoc');
} catch (e) {
  module = angular.module('envoc', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/datatables/oTablePagination.tmpl.html',
    '<div pagination total-items="ctrl.state.iTotalDisplayRecords" \n' +
    '        items-per-page="ctrl.state.linesPerPage" \n' +
    '        max-size="{{ctrl.paginationSettings.maxSize}}"\n' +
    '        previous-text="{{ctrl.paginationSettings.previousText}}"\n' +
    '        next-text="{{ctrl.paginationSettings.nextText}}"\n' +
    '        ng-model="ctrl.state.currentPage"\n' +
    '        ng-show="ctrl.data.length">\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('envoc');
} catch (e) {
  module = angular.module('envoc', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/pagination/pager.html',
    '<ul class="pager">\n' +
    '  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n' +
    '  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n' +
    '</ul>');
}]);
})();

(function(module) {
try {
  module = angular.module('envoc');
} catch (e) {
  module = angular.module('envoc', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/pagination/pagination.html',
    '<ul class="pagination">\n' +
    '  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText(\'first\')}}</a></li>\n' +
    '  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n' +
    '  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>\n' +
    '  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n' +
    '  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText(\'last\')}}</a></li>\n' +
    '</ul>');
}]);
})();

angular.module('envoc')
  .filter('startFrom', function() {
      return function(input, start) {
          if (input === undefined) {
              return input;
          } else {
              return input.slice(+start);
          }
      };
  });
angular.module('envoc')
  .provider('oTableConfig', function() {
    var config = {
      templates: {
        oTableLinesPerPageUrl: '/oTemplates/datatables/oTableLinesPerPage.tmpl.html',
        oTablePageInfoUrl: '/oTemplates/datatables/oTablePageInfo.tmpl.html',
        oTablePaginationUrl: '/oTemplates/datatables/oTablePagination.tmpl.html'
      },
      addLangConfig: addLangConfig,
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
      },
      defaultLang: 'en'
    };
    return {
      config: config,
      addLangConfig: addLangConfig,
      $get: function() {
        return config;
      }
    }

    function addLangConfig(key, langConfig){
      config.i18n[key] = langConfig;
      config.defaultLang = key;
    }
  })
  .controller('oTableCtrl', ["$scope", "$http", "$filter", "$rootScope", "$timeout", "oTableConfig", function($scope, $http, $filter, $rootScope, $timeout, oTableConfig) {
    var self      = this;
    var dataCache = [];

    var config    = {
      fetchMethod: null,
      linesPerPage: 10,
      throttle: 0,
      defaultSort: [],
      linesPerPageOptions: [5,10,25,50,100]
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
      var lang = config_.lang || oTableConfig.defaultLang;
      self.lang = oTableConfig.i18n[lang];
      angular.extend(config, config_);

      self.paginationSettings = config_.paginationSettings || self.lang;
      self.linesPerPageOptions = config.linesPerPageOptions;

      if (!config.dataSrcUrl && !config.dataSrc && !config.fetchMethod) {
        throw new Error('A data source is required');
      }

      if (config.dataSrcUrl && !config.fetchMethod){
        config.fetchMethod = defaultFetch;
      }

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
      oTableConfig.defaultLang = key;
      self.lang = oTableConfig.i18n[key];
      self.paginationSettings = _.extend({}, self.paginationSettings, self.lang);
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
  }])
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

angular.module('envoc')
    .directive('oTableDefault', function() {
        return {
            templateUrl: '/oTemplates/datatables/oTableDefault.tmpl.html',
            require: '^oTable',
            restrict: 'EA',
            transclude: true,
            scope: {},
            compile: function compile(tElement, tAttrs, transclude) {
                return function postLink(scope, iElement, iAttrs, controller) {
                    ctor();
                    function ctor() {
                        scope.ctrl = controller;
                        scope.$watch(getOTableData, applyToScope);
                        iElement.find('table').addClass('table table-striped dataTable');
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
angular.module('envoc')
    .directive('oTableFilter', function() {
        return {
            restrict: 'A',
            scope: true,
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {

                scope.$on('oTable::internalStateChanged', function(){
                  iElement.val(controller.state.allSearch);
                });

                iElement.on('keyup change', setAllSearch);
                
                function setAllSearch(){
                    scope.$evalAsync(function(){
                        controller.state.allSearch = iElement.val();
                    });
                }
            }
        };
    })
    .directive('oTableColumnFilter', function() {
        return {
            restrict: 'A',
            scope: true,
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                var propertyName = iAttrs.field;

                iElement.on('keyup change', setAllSearch)
                
                function setAllSearch(){
                    scope.$evalAsync(function(){
                        controller.columnFilter(iElement.val(), propertyName);
                    });
                }
            }
        };
    });

angular.module('envoc')
  .directive('oTableLinesPerPage', ["oTableConfig", function(oTableConfig) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      templateUrl: oTableConfig.templates.oTableLinesPerPageUrl,
      require: '^oTable',
      link: function postLink(scope, iElement, iAttrs, controller) {
        scope.ctrl = controller;
      }
    };
  }]);

angular.module('envoc')
  .directive('oTablePageInfo', ["oTableConfig", function(oTableConfig) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      templateUrl: oTableConfig.templates.oTablePageInfoUrl,
      require: '^oTable',
      link: function postLink(scope, iElement, iAttrs, controller) {
        scope.ctrl = controller;
      }
    };
  }]);

angular.module('envoc')
  .directive('oTablePagination', ["oTableConfig", function(oTableConfig) {
    return {
      restrict: 'A',
      scope: true,
      templateUrl: oTableConfig.templates.oTablePaginationUrl,
      require: '^oTable',
      link: function postLink(scope, iElement, iAttrs, controller) {
        scope.ctrl = controller;

        scope.ctrl.paginationSettings = angular.extend({
          maxSize: 5,
          previousText: 'Previous',
          nextText: 'Next',
          directionLinks: true,
          rotate: true
        }, scope.ctrl.paginationSettings);
      }
    };
  }]);

/*
 * Example use: <th o-table-sort field="id">Id</th>
 * params: (attribute field): this is the case-sensative key to sort on.
 */

angular.module('envoc')
    .directive('oTableSort', function() {
        return {
            restrict: 'A',
            scope: true,
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                var propertyName = iAttrs.field;
                iElement.addClass('sorting');

                scope.$on('oTable::sorting', function() {
                    var sortInfo = controller.getSortingPropertyInfo(propertyName);

                    angular.forEach(['sorting_asc', 'sorting_desc'], function(css) {
                        iElement.removeClass(css);
                    });

                    if (sortInfo.sorting) {
                        iElement.addClass('sorting_' + sortInfo.direction);
                    }
                })

                iElement.on('click', function(e) {
                    clear();
                    scope.$evalAsync(function(){
                        controller.sortOn(e.shiftKey, propertyName);
                    });
                });

                function clear() {
                    if (window.getSelection) {
                        if (window.getSelection().empty) { // Chrome
                            window.getSelection().empty();
                        } else if (window.getSelection().removeAllRanges) { // Firefox
                            window.getSelection().removeAllRanges();
                        }
                    } else if (document.selection) { // IE?
                        document.selection.empty();
                    }
                }
            }
        };
    });
(function () {
    'use strict';
    angular
        .module('envoc')
        .service('apiClient', ['$http', 'errorService', 'defaultNamespace', 'namespacePropName',
            function ($http, errorService, defaultNamespace, namespacePropName) {
                var constructorFn = apiClient;

                function apiClient(nameSpace, _http) {
                    var service = this;
                    var http = _http;

                    var idempotentMethods = ['get', 'head', 'delete', 'jsonp'];
                    //these take an optional data param that needs to be handled separately
                    var nonIdempotentMethods = ['post', 'put', 'patch'];

                    service.nameSpace = nameSpace;

                    service.bindNamespace = function (ns) {
                        return new constructorFn(ns, http);
                    };

                    /**decorate calls to $http by modifying the parameters*/
                    idempotentMethods.forEach(function (method) {
                        service[method] = function (url, config) {
                            return $http[method].call($http, url, decorateConfig(config));
                        };
                    });

                    nonIdempotentMethods.forEach(function (method) {
                        service[method] = function (url, data, config) {
                            return $http[method].call($http, url, data, decorateConfig(config));
                        };
                    });

                    function decorateConfig(config) {
                        var _config = typeof config !== 'undefined' ? config : {};
                        _config[namespacePropName] = service.nameSpace;
                        return _config;
                    }
                }

                return new apiClient(defaultNamespace, $http);
            }
        ]);
})();
(function () {
    'use strict';
    angular
        .module('envoc')
        .factory('errorNamespacingHttpInterceptor', ['$q', 'errorService', 'namespacePropName', function ($q, errorService, namespacePropName) {
            return {
                request: function (request) {
                    if (typeof request[namespacePropName] !== 'undefined') {
                        errorService.clearNamespace(request[namespacePropName]);
                    }
                    return request;
                },
                response: function (response) {
                    return response;
                },
                responseError: function (rejection) {
                    var requestNamespace = rejection.config[namespacePropName];
                    if (typeof requestNamespace !== 'undefined') {
                        errorService.addErrors(requestNamespace, rejection.data.errors);
                    }
                    return $q.reject(rejection);
                }
            };
        }]);
})();
(function () {
    'use strict';
    angular
        .module('envoc')
        .service('errorService', ['$timeout', function errorService($timeout) {
            function service() {
                var srvc = this;
                srvc.errors = {};

                srvc.clear = function () {
                    srvc.errors = {};
                };

                srvc.clearNamespace = function (namespace) {
                    srvc.errors[namespace] = [];
                };

                srvc.addErrors = function (namespace, errors) {
                    $timeout(function () {
                        srvc.clearNamespace(namespace);
                        srvc.errors[namespace] = errors;
                    });
                };
            }
            return new service();
        }]);
})();
(function () {
    'use strict';
    angular
        .module('envoc')
        .factory('noCacheInterceptor', [function () {
            return {
                request: function (config) {
                    if (config.method == 'GET' && config.url.indexOf(".html") == -1) {
                        var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                        config.url = config.url + separator + 'c=' + new Date().getTime();
                    }
                    return config;
                }
            };
        }]);
})();
(function () {
    'use strict';

    angular
        .module('envoc')
        .directive('validationClassFor', ['errorService', 'defaultNamespace', function (errorService, defaultNamespace) {
        return {
            restrict: 'A',
            link: function (scope, element, attr){
                var namespace = attr.namespace || defaultNamespace;
                scope.$watch(watchErrors, updateMatches, true);

                function updateMatches(errors) {
                    //if (attr.spotterValidationClassIf.length && !scope.$eval(attr.spotterValidationClassIf)) {
                    //    element.removeClass('has-error');
                    //    return;
                    //}

                    var namespaceErrors = errors[namespace] || {};

                    _.some(namespaceErrors, propertyIsMatch)
                        ? element.addClass('has-error')
                        : element.removeClass('has-error');
                }

                function propertyIsMatch(error) {
                    //This allows for watching multiple properties
                    var propertyNames = attr.validationClassFor.toLowerCase().split(' ');

                    return _.some(propertyNames, function(prop) {
                        return error.propertyName.toLowerCase() == prop.toLowerCase();
                    });
                }

                function watchErrors() {
                    return errorService.errors;
                }
            }
        }
    }]);
})();

(function () {
    'use strict';
    angular
       .module('envoc')
       .directive('validationMessage', ['errorService', function (errorService) {
           return {
               restrict: 'E',
               scope: { 'for': '@', 'namespace': '@' },
               template: '<div ng-repeat="error in matches" class="help-block">{{error.errorMessage}}</div>\n',
               bindToController: true,
               controllerAs: 'validateCtrl',
               controller: ['$scope', 'defaultNamespace', function ($scope, defaultNamespace) {
                   var vm = this;
                   vm.namespace = vm.namespace || defaultNamespace;
                   $scope.$watch(watchErrors, updateMatches, true);

                   function updateMatches(errors) {
                       var namespaceErrors = errors[vm.namespace] || {};
                       $scope.matches = _.filter(namespaceErrors, propertyIsMatch);
                   }

                   function propertyIsMatch(error) {
                       if (typeof vm.for !== 'undefined') {
                           return error.propertyName.toLowerCase() == vm.for.toLowerCase();
                       }
                       return true;
                   }

                   function watchErrors() {
                       return errorService.errors;
                   }
               }]
           };
       }]);
})();
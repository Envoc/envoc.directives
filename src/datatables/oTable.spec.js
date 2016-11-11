(function() {
  'use strict';

  describe('Directive: oTable', function() {

    var $rootScope,
      $compile,
      $httpBackend,
      $q,
      element,
      scope;

    describe('Directive: oTableDefault', function() {
      beforeEach(function() {
        scope.config = {
          dataSrc: [{
            id: 1,
            name: 'bob'
          }]
        }
      });
    });

    describe('Provider Configuration:', function() {
      var customRoute = '/my/custom/route',
        config;

      beforeEach(module('envoc', function(oTableConfigProvider) {
        oTableConfigProvider.config.templates.oTableLinesPerPageUrl = customRoute;
      }));

      beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        config = $injector.get('oTableConfig');
      }));

      it('allow changing the directive template Urls', function() {
        expect(config.templates.oTableLinesPerPageUrl).toBe(customRoute);
      });
    });

    describe('Configuration:', function() {
      beforeEach(module('envoc'));

      beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
        scope = $rootScope.$new();
        scope.config = {};
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should compile and requires config', function() {
        element = angular.element('<div o-table config="config"></div>');
        expect(compile).toThrow();

        scope.config = {
          dataSrcUrl: '/data/get'
        }

        $httpBackend
          .expect('POST', scope.config.dataSrcUrl)
          .respond(httpResponse1);

        element = angular.element('<div o-table config="config"></div>');
        expect(compile).not.toThrow();

        scope.config = {
          dataSrc: [{
            id: 1,
            name: 'bob'
          }, {
            id: 2,
            name: 'john'
          }]
        }

        element = angular.element('<div o-table config="config"></div>');
        expect(compile).not.toThrow();

        $httpBackend.flush();

        function compile() {
          element = $compile(element)(scope);
          scope.$digest();
        }
      });

      it('should expose the state', function() {
        scope.config = {
          dataSrc: [{
            id: 1
          }]
        };

        scope.state = {};

        element = angular.element('<div o-table config="config" state="state"></div>');
        element = $compile(element)(scope);

        scope.$digest();
        expect(scope.state.currentPage).toBe(1);
      });

      describe('saving state', function() {
        var sessionSaveKey = 'this_instance';
        var savedSettings = {
          time: +new Date(),
          allSearch: "",
          currentPage: 2,
          linesPerPage: 5
        };

        afterEach(function() {
          localStorage.removeItem(sessionSaveKey);
        });

        it('should use a saved config', function() {
          expect(localStorage.getItem(sessionSaveKey)).toBe(null);

          localStorage.setItem(sessionSaveKey, angular.toJson(savedSettings));
          scope.config = {
            dataSrc: _.times(15, function(n) { return {id: n }; }),
            saveState: sessionSaveKey
          };

          scope.state = {};

          element = angular.element('<div o-table config="config" state="state"></div>');
          element = $compile(element)(scope);

          scope.$digest();
          expect(scope.state.currentPage).toBe(savedSettings.currentPage);
        });

        it('should not set page past valid range', function() {
          expect(localStorage.getItem(sessionSaveKey)).toBe(null);

          localStorage.setItem(sessionSaveKey, angular.toJson(savedSettings));
          scope.config = {
            dataSrc: _.times(5, function(n) { return {id: n }; }),
            saveState: sessionSaveKey
          };

          scope.state = {};

          element = angular.element('<div o-table config="config" state="state"></div>');
          element = $compile(element)(scope);

          scope.$digest();
          expect(scope.state.currentPage).toBe(1);
        });

        it('should update saved config', function() {
          var state;

          scope.config = {
            dataSrc: _.times(15, function(n) { return {id: n }; }),
            saveState: sessionSaveKey
          };

          scope.state = {};

          element = angular.element('<div o-table config="config" state="state"></div>');
          element = $compile(element)(scope);

          scope.$digest();
          state = angular.fromJson(localStorage.getItem(sessionSaveKey));
          expect(state.currentPage).toBe(scope.state.currentPage);

          scope.state.currentPage = 2;
          scope.$digest();
          state = angular.fromJson(localStorage.getItem(sessionSaveKey));
          expect(state.currentPage).toBe(scope.state.currentPage);
        });
      });
    });


    describe('Remote Data:', function() {
      var html;

      beforeEach(module('envoc', function(oTableConfigProvider) {
        oTableConfigProvider.addLangConfig('fr', {
          show: 'Le Show',
          entries: 'Le entries',
          nextText: 'Le Next',
          previousText: 'Le Previous'
        })
      }));

      beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
        scope = $rootScope.$new();
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      beforeEach(function() {
        scope.config = {};
        html = "" + 
          "<div o-table config='config'>" +
            "<div o-table-lines-per-page></div>" +
              "<table>" +
                "<thead>" +
                  "<tr role=\"row\">" +
                    "<th>Start Date</th>" +
                    "<th>Is Closed</th>" +
                    "<th o-table-sort field=\"Id\">Id</th>" +
                    "<th>Registration Count</th>" +
                  "</tr>" +
                "</thead>" +
                "<tbody o-table-controller>" +
                  "<tr ng-repeat=\"row in ctrl.data\">" +
                    "<td>{{ctrl.parseDate(row.StartDateUtc) | date:'medium'}}</td>" +
                    "<td>{{row.IsClosed}}</td>" +
                    "<td>{{row.Id}}</td>" +
                    "<td>{{row.RegistrationCount}}</td>" +
                  "</tr>" +
                "</tbody>" +
              "</table>" +
            "<div o-table-pagination></div>" +
          '</div>';
      });

      it('should post to config url', function() {
        scope.config.dataSrcUrl = '/data/get';
        element = angular.element('<div o-table config="config" id="childScope"></div>');
        element = $compile(element)(scope);

        $httpBackend
          .expect('POST', scope.config.dataSrcUrl)
          .respond(httpResponse1);

        $rootScope.$digest();
        $httpBackend.flush();
      });

      it('should call fetchMethod with datatable request object when provided', function() {
        var spy = jasmine.createSpy();
        scope.config.fetchMethod = fetchMethod;
        scope.config.linesPerPage = 15;

        compile();

        expect(spy).toHaveBeenCalledWith({
          Skip: 0,
          Take: 15,
          AllSearch: '',
          Columns: []
        });

        function fetchMethod(request) {
          var dfd = $q.defer();
          spy(request);
          dfd.resolve({
            data: httpResponse1
          });
          return dfd.promise;
        };
      });

      it('should call get additional params when provided', function() {
        var spy = jasmine.createSpy();
        scope.config.fetchMethod = fetchMethod;
        scope.config.getAdditionalParams = function() {
          return {
            name: 'spaceman'
          }
        }
        scope.config.linesPerPage = 15;

        compile();

        expect(spy).toHaveBeenCalledWith({
          Skip: 0,
          Take: 15,
          AllSearch: '',
          Columns: [],
          name: 'spaceman'
        });

        function fetchMethod(request) {
          var dfd = $q.defer();
          spy(request);
          dfd.resolve({
            data: httpResponse1
          });
          return dfd.promise;
        };
      });

      it('should databind via fetchMethod', function() {
        scope.config.fetchMethod = fetchMethod;

        compile();

        var tbody = element.find('tbody');
        var rowCount = tbody.find('tr').length;
        expect(rowCount).toBe(httpResponse1.aaData.length);

        function fetchMethod() {
          return $q.when({
            data: httpResponse1
          });
        };
      });

      it('should allow configuring languages - default english', function() {
        scope.config.fetchMethod = fetchMethod;

        compile();

        expect(element.text()).toContain('Show');
        expect(element.text()).toContain('Previous');
        expect(element.text()).toContain('Next');

        function fetchMethod() {
          return $q.when({
            data: httpResponse1
          });
        };
      });

      it('should allow configuring languages - french', function() {
        scope.config.fetchMethod = fetchMethod;
        scope.config.lang = 'fr';

        compile();

        expect(element.text()).toContain('Le Show');
        expect(element.text()).toContain('Le Previous');
        expect(element.text()).toContain('Le Next');

        function fetchMethod() {
          return $q.when({
            data: httpResponse1
          });
        };
      });

      it('should watch the current page and fetch accordingly', function() {
        scope.config = {
          dataSrcUrl: '/data/get'
        };

        scope.state = {};

        $httpBackend
          .expect('POST', scope.config.dataSrcUrl)
          .respond(httpResponse1);

        html = '<div o-table config="config" state="state"><div o-table-default fields="id"></div></div>';
        compile();

        expect(scope.state.currentPage).toBe(1);

        scope.state.currentPage = 2;

        $httpBackend
          .expect('POST', scope.config.dataSrcUrl)
          .respond(httpResponse1);

        scope.$digest();
        $httpBackend.flush();
      });

      describe('table sorting', function() {
        it('should add sorting params when sort clicked', function() {
          var spy = jasmine.createSpy();
          scope.config.fetchMethod = fetchMethod;
          scope.config.linesPerPage = 15;

          compile();

          var sortField = element.find('[o-table-sort]');

          expect(sortField.length).toBe(1); // test case has required element
          expect(spy).toHaveBeenCalledWith({
            Skip: 0,
            Take: 15,
            AllSearch: '',
            Columns: []
          });

          sortField.click();
          $rootScope.$digest();
          expect(spy.mostRecentCall.args[0]).toEqual({
            Skip: 0,
            Take: 15,
            AllSearch: '',
            Columns: [{
              ColumnIndex: 0,
              SortDirection: 'asc',
              SearchTerm: null
            }]
          });

          sortField.click();
          $rootScope.$digest();
          expect(spy.mostRecentCall.args[0]).toEqual({
            Skip: 0,
            Take: 15,
            AllSearch: '',
            Columns: [{
              ColumnIndex: 0,
              SortDirection: 'desc',
              SearchTerm: null
            }]
          });

          function fetchMethod(request) {
            var dfd = $q.defer();
            spy(request);
            dfd.resolve({
              data: httpResponse1
            });
            return dfd.promise;
          };
        });

        it('should allow setting a default sort', function() {
          var spy = jasmine.createSpy();
          var expectedSort = {
            ColumnIndex: 2,
            SortDirection: 'desc',
            SearchTerm: null
          };

          scope.config.defaultSort = [
            [2, "desc"]
          ]
          scope.config.fetchMethod = fetchMethod;
          scope.config.linesPerPage = 15;

          compile();

          expect(spy).toHaveBeenCalledWith({
            Skip: 0,
            Take: 15,
            AllSearch: '',
            Columns: [expectedSort]
          });

          function fetchMethod(request) {
            var dfd = $q.defer();
            spy(request);
            dfd.resolve({
              data: httpResponse1
            });
            return dfd.promise;
          };
        });

        it('should allow setting a default sort with default search', function() {
          var spy = jasmine.createSpy();
          var expectedSort = {
            ColumnIndex: 2,
            SortDirection: 'desc',
            SearchTerm: "boom"
          };

          scope.config.defaultSort = [
            [2, "desc", "boom"]
          ]
          scope.config.fetchMethod = fetchMethod;
          scope.config.linesPerPage = 15;

          compile();

          expect(spy).toHaveBeenCalledWith({
            Skip: 0,
            Take: 15,
            AllSearch: '',
            Columns: [expectedSort]
          });

          function fetchMethod(request) {
            var dfd = $q.defer();
            spy(request);
            dfd.resolve({
              data: httpResponse1
            });
            return dfd.promise;
          };
        });
      });

      function compile() {
        element = angular.element(html);
        element = $compile(element)(scope);
        $rootScope.$digest();
      }
    });
  });

  var httpResponse1 = {
    "sEcho": 1,
    "iTotalRecords": 9,
    "iTotalDisplayRecords": 9,
    "aaData": [
      [1, "\/Date(1383171098853)\/", "\/Date(1383171394617)\/", "Yes", 1],
      [2, "\/Date(1383171547680)\/", null, "No", 4],
      [3, "\/Date(1383171547680)\/", null, "No", 4],
      [4, "\/Date(1383171547680)\/", null, "No", 4],
      [5, "\/Date(1383171547680)\/", null, "No", 4],
      [6, "\/Date(1383171547680)\/", null, "No", 4],
      [7, "\/Date(1383171547680)\/", null, "No", 4],
      [8, "\/Date(1383171547680)\/", null, "No", 4],
      [9, "\/Date(1383171547680)\/", null, "No", 4]
    ],
    "sColumns": "Id,StartDateUtc,EndDateUtc,IsClosed,RegistrationCount"
  }
})();

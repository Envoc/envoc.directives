(function() {
    'use strict';

    describe('Directive: oTable', function() {

        // load the service's module
        beforeEach(module('envoc.directives.datatables'));

        var $rootScope,
            $compile,
            $httpBackend,
            $q,
            element,
            scope;

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

        describe('Directive: oTableDefault', function(){
            beforeEach(function() {
                scope.config = {
                    dataSrc: [{id:1, name:'bob'}]
                }
            });

            // it('should throw without a field list', function() {
            //     element = angular.element('<div o-table config="config" id="childScope"><div o-table-default></div></div>');
            //     expect(compile).toThrow();

            //     function compile(){
            //         element = $compile(element)(scope);
            //         $rootScope.$digest();
            //     }
            // });
        });

        describe('Configuration:', function(){
            beforeEach(function() {
                scope.config = {}
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
                    dataSrc: [
                        {id: 1, name: 'bob'},
                        {id: 2, name: 'john'}
                    ]
                }

                element = angular.element('<div o-table config="config"></div>');
                expect(compile).not.toThrow();

                $httpBackend.flush();

                function compile() {
                    element = $compile(element)(scope);
                    scope.$digest()
                }
            });

            it('should expose the state', function() {
                scope.config = {
                    dataSrc: [{id:1}]
                }

                scope.state = {};
                
                element = angular.element('<div o-table config="config" state="state"><div o-table-default fields="id"></div></div>');
                element = $compile(element)(scope);

                scope.$digest();
                expect(scope.state.currentPage).toBe(1);
            });
        });

        describe('Remote Data:', function(){
            var html;

            beforeEach(function() {
                scope.config = {}
                html =  '<div o-table config="config">' + 
                            "<div o-table-default><table><thead><tr role=\"row\"><th>Start Date</th><th>Is Closed</th><th>Id</th><th>Registration Count</th></tr></thead><tbody o-table-repeat><tr ng-repeat=\"row in ctrl.data\"><td>{{ctrl1.parseDate(row.StartDateUtc) | date:'medium'}}</td><td>{{row.IsClosed}}</td><td>{{row.Id}}</td><td>{{row.RegistrationCount}}</td></tr></tbody></table></div>" +
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

                expect(spy).toHaveBeenCalledWith({Skip: 0, Take: 15, AllSearch: ''});

                function fetchMethod(request){
                    var dfd = $q.defer();
                    spy(request);
                    dfd.resolve({data:httpResponse1});
                    return dfd.promise;
                };
            });

            it('should call get additional params when provided', function() {
                var spy = jasmine.createSpy();
                scope.config.fetchMethod = fetchMethod;
                scope.config.getAdditionalParams = function(){
                    return {name:'spaceman'}
                }
                scope.config.linesPerPage = 15;

                compile();

                expect(spy).toHaveBeenCalledWith({Skip: 0, Take: 15, AllSearch: '', name:'spaceman'});

                function fetchMethod(request){
                    var dfd = $q.defer();
                    spy(request);
                    dfd.resolve({data:httpResponse1});
                    return dfd.promise;
                };
            });

            it('should databind via fetchMethod', function() {
                scope.config.fetchMethod = fetchMethod;
                
                compile();

                var tbody = element.find('tbody');
                var rowCount = tbody.find('tr').length;
                
                expect(rowCount).toBe(httpResponse1.aaData.length);
                
                function fetchMethod(){
                    return $q.when({data:httpResponse1});
                };
            });

            it('should watch the current page and fetch accordingly', function() {
                scope.config = {
                    dataSrcUrl: '/data/get'
                }

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

            function compile(){
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

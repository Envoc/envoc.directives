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

        describe('Directive: oTableDefault', function(){
            beforeEach(function() {
                scope.config = {
                    dataSrc: [{id:1, name:'bob'}]
                }
            });

            it('should throw without a field list', function() {
                element = angular.element('<div o-table config="config" id="childScope"><div o-table-default></div></div>');
                expect(compile).toThrow();

                function compile(){
                    element = $compile(element)(scope);
                    $rootScope.$digest();
                }
            });
        });

        describe('Configuration:', function(){
            beforeEach(function() {
                scope.config = {}
            });

            it('should throw without a field list', function() {
                scope.config.dataSrc = [{id:1, name:'bob'}];

                element = angular.element('<div o-table config="config" id="childScope"><div o-table-default fields="id,name"></div></div>');                
                element = $compile(element)(scope);
                $rootScope.$digest();

                var tbody = element.find('tbody');
                var rowCount = tbody.find('tr').length;

                expect(rowCount).toBe(1);

                scope.config.dataSrc.push({id:2, name:'john'});
                $rootScope.$digest();

                rowCount = tbody.find('tr').length;

                expect(rowCount).toBe(2);
            });

            it('should compile and requires config', function() {
                element = angular.element('<div o-table config="config"></div>');
                expect(compile).toThrow();

                scope.config = {
                    dataSrcUrl: '/data/get'
                }

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

                function compile() {
                    element = $compile(element)(scope);
                }
            });
        });

        describe('Remote Data:', function(){
            var html;

            beforeEach(function() {
                scope.config = {}
                html =  '<div o-table config="config">' + 
                            '<div o-table-default fields="Id,StartDateUtc,EndDateUtc,IsClosed,RegistrationCount"></div>' +
                        '</div>';
            });

            it('should post to config url', function() {
                scope.config.dataSrcUrl = '/data/get';
                element = angular.element('<div o-table config="config" id="childScope"></div>');
                element = $compile(element)(scope);

                $httpBackend
                    .expect('POST', scope.config.dataSrcUrl)
                    .respond(httpResponse1);

                $httpBackend.flush();
                $rootScope.$digest();
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

            function compile(){
                element = angular.element(html);
                element = $compile(element)(scope);
                $rootScope.$digest();
            }
        });
    });

    // TODO: Cases:
    //  -- [X] Property not found on data-bound object
    //  -- [ ] Handle triming the list

    var httpResponse1 = {
        "sEcho": 1,
        "iTotalRecords": 2,
        "iTotalDisplayRecords": 2,
        "aaData": [
            [2, "\/Date(1383171547680)\/", null, "No", 4],
            [1, "\/Date(1383171098853)\/", "\/Date(1383171394617)\/", "Yes", 1]
        ],
        "sColumns": "Id,StartDateUtc,EndDateUtc,IsClosed,RegistrationCount"
    }
})();

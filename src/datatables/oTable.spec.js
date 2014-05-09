(function() {
    'use strict';

    describe('Directive: oTable', function() {

        // load the service's module
        beforeEach(module('envoc.directives.datatables'));

        var $rootScope,
            $compile,
            $httpBackend,
            element,
            scope;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $httpBackend = $injector.get('$httpBackend');
            scope = $rootScope.$new();
        }));

        it('should compile and requires config', function() {
            element = angular.element('<div o-table config="config"><div o-table-default></div></div>');
            expect(compile).toThrow();

            scope.config = {
                dataSrcUrl: '/data/get'
            }

            element = angular.element('<div o-table config="config"><div o-table-default></div></div>');
            expect(compile).not.toThrow();

            scope.config = {
                dataSrc: [
                    {id: 1, name: 'bob'},
                    {id: 2, name: 'john'}
                ]
            }

            element = angular.element('<div o-table config="config"><div o-table-default></div></div>');
            expect(compile).not.toThrow();

            function compile() {
                element = $compile(element)(scope);
            }
        });

        describe('configuration', function() {
            beforeEach(function() {
                scope.config = {
                    dataSrcUrl: '/data/get'
                }
            });

            it('should post to config url', function() {
                element = angular.element('<div o-table config="config" id="childScope"><div o-table-default>{{data.iTotalRecords}}</div></div>');
                element = $compile(element)(scope);

                $httpBackend
                    .expect('POST', scope.config.dataSrcUrl)
                    .respond(httpResponse1);

                $httpBackend.flush();
                $rootScope.$digest();
                // expect(element.text()).toBe(2);
            });
        });
    });

    // TODO: Write oTableDefault Tests
    // Cases:
    //  -- Property not found on data-bound object
    //  -- Handle triming the list

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

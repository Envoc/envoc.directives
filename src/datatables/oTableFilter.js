(function() {
    'use strict';

    var app = angular.module('envoc.directives.datatables');

    app.directive('oTableFilter', function() {
        return {
            restrict: 'A',
            scope: true,
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                iElement.on('keyup change', setAllSearch)
                
                function setAllSearch(){
                    scope.$evalAsync(function(){
                        controller.state.allSearch = iElement.val();
                    });
                }
            }
        };
    });

    app.directive('oTableColumnFilter', function() {
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
    
})();

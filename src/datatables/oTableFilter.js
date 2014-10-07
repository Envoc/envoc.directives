angular.module('envoc.directives.datatables')
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

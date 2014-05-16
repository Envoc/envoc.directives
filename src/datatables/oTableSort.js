(function() {
    'use strict';

    var app = angular.module('envoc.directives.datatables');

    app.directive('oTableSort', function() {
        return {
            restrict: 'A',
            scope: true,
            require: '^oTable',
            link: function postLink(scope, iElement, iAttrs, controller) {
                var propertyName = iAttrs.field;
                iElement.addClass('sortable');

                scope.$on('oTable::sorting', function() {
                    var sortInfo = controller.getSortingPropertyInfo(propertyName);

                    angular.forEach(['sorting', 'asc', 'desc'], function(css) {
                        iElement.removeClass(css);
                    });

                    if (sortInfo.sorting) {
                        iElement.addClass('sorting');
                        iElement.addClass(sortInfo.direction);
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

})();

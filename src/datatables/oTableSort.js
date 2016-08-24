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
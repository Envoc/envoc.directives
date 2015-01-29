(function(module) {
try {
  module = angular.module('envoc.directives.partials');
} catch (e) {
  module = angular.module('envoc.directives.partials', []);
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

(function(module) {
try {
  module = angular.module('envoc.directives.partials');
} catch (e) {
  module = angular.module('envoc.directives.partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/datatables/oTablePagination.tmpl.html',
    '<div pagination total-items="ctrl.state.iTotalDisplayRecords" \n' +
    '        items-per-page="ctrl.state.linesPerPage" \n' +
    '        ng-model="ctrl.state.currentPage">\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('envoc.directives.partials');
} catch (e) {
  module = angular.module('envoc.directives.partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/datatables/oTableLinesPerPage.tmpl.html',
    '<label>\n' +
    '    Show\n' +
    '    <select ng-model="ctrl.state.linesPerPage">\n' +
    '        <option value="10">10</option>\n' +
    '        <option value="25">25</option>\n' +
    '        <option value="50">50</option>\n' +
    '        <option value="100">100</option>\n' +
    '    </select>\n' +
    '    entries\n' +
    '</label>');
}]);
})();

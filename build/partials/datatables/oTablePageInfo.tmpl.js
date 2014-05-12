(function(module) {
try {
  module = angular.module('envoc.directives.partials');
} catch (e) {
  module = angular.module('envoc.directives.partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/datatables/oTablePageInfo.tmpl.html',
    '<div class="dataTables_info">\n' +
    '    {{ctrl.state.pageStartIdx + 1}} - {{ctrl.state.pageStopIdx}}\n' +
    '    of {{ctrl.state.iTotalDisplayRecords}}\n' +
    '    entries\n' +
    '    <span ng-show="ctrl.state.iTotalRecords !== ctrl.state.iTotalDisplayRecords">\n' +
    '        (filtered from {{ctrl.state.iTotalRecords}})\n' +
    '    </span>\n' +
    '</div>');
}]);
})();

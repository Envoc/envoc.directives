angular.module('envoc.directives.datatables')
  .directive('oTableLinesPerPage', function(oTableConfig) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      templateUrl: oTableConfig.templates.oTableLinesPerPageUrl,
      require: '^oTable',
      link: function postLink(scope, iElement, iAttrs, controller) {
        scope.ctrl = controller;
      }
    };
  });

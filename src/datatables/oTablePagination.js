angular.module('envoc.directives.datatables')
  .directive('oTablePagination', function(oTableConfig) {
    return {
      restrict: 'A',
      scope: true,
      templateUrl: oTableConfig.templates.oTablePaginationUrl,
      require: '^oTable',
      link: function postLink(scope, iElement, iAttrs, controller) {
        scope.ctrl = controller;

        scope.ctrl.paginationSettings = angular.extend({
          maxSize: 5,
          previousText: 'Previous',
          nextText: 'Next',
          directionLinks: true,
          rotate: true
        }, scope.ctrl.paginationSettings);
      }
    };
  });

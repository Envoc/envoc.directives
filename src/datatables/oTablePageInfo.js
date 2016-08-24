angular.module('envoc')
  .directive('oTablePageInfo', function(oTableConfig) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      templateUrl: oTableConfig.templates.oTablePageInfoUrl,
      require: '^oTable',
      link: function postLink(scope, iElement, iAttrs, controller) {
        scope.ctrl = controller;
      }
    };
  });

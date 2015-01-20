(function() {
  'use strict';

  angular.module('envoc.directives.validation', ['envoc.directives.partials'])
    .provider('oValidateConfig', function() {
      var config = {
        templates: {
          oValidationMessageFor: '/oTemplates/validation/oValidationMessageFor.tmpl.html',
          oValidationMessageForModelstate: '/oTemplates/validation/oValidationMessageForModelstate.tmpl.html',
          oValidationSummary: '/oTemplates/validation/oValidationSummary.tmpl.html'
        }
      };
      return {
        config: config,
        $get: function() {
          return config;
        }
      }
    });
})();

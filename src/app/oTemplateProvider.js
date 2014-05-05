(function() {
    'use strict';

    function TemplateUtils($templateCache, $http) {
        this.setTemplate = function (path, html) {
            $templateCache.put(path, html);
        };

        this.mapTemplateToUrl = function (path, url) {
            $http
                .get(url)
                .then(function (response) {
                    $templateCache.put(path, response.data);
                });
        };
    }

    angular
        .module('envoc.directives')
        .provider('oTemplate', function() {
            this.$get = ['$injector', function ($injector) {
                var $templateCache, $http;

                $templateCache = $injector.get('$templateCache');
                $http = $injector.get('$http');

                return new TemplateUtils($templateCache, $http);
            }];
        });
})();
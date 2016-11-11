(function () {
    'use strict';
    angular
        .module('envoc')
        .service('apiClient', ['$http', 'errorService', 'defaultNamespace', 'namespacePropName',
            function ($http, errorService, defaultNamespace, namespacePropName) {
                var constructorFn = apiClient;

                function apiClient(nameSpace, _http) {
                    var service = this;
                    var http = _http;

                    var idempotentMethods = ['get', 'head', 'delete', 'jsonp'];
                    //these take an optional data param that needs to be handled separately
                    var nonIdempotentMethods = ['post', 'put', 'patch'];

                    service.nameSpace = nameSpace;

                    service.bindNamespace = function (ns) {
                        return new constructorFn(ns, http);
                    };

                    /**decorate calls to $http by modifying the parameters*/
                    idempotentMethods.forEach(function (method) {
                        service[method] = function (url, config) {
                            return $http[method].call($http, url, decorateConfig(config));
                        };
                    });

                    nonIdempotentMethods.forEach(function (method) {
                        service[method] = function (url, data, config) {
                            return $http[method].call($http, url, data, decorateConfig(config));
                        };
                    });

                    function decorateConfig(config) {
                        var _config = typeof config !== 'undefined' ? config : {};
                        _config[namespacePropName] = service.nameSpace;
                        return _config;
                    }
                }

                return new apiClient(defaultNamespace, $http);
            }
        ]);
})();
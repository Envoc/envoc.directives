(function () {
    'use strict';
    angular
        .module('envoc')
        .factory('errorNamespacingHttpInterceptor', ['$q', 'errorService', 'namespacePropName', function ($q, errorService, namespacePropName) {
            return {
                request: function (request) {
                    if (typeof request[namespacePropName] !== 'undefined') {
                        errorService.clearNamespace(request[namespacePropName]);
                    }
                    return request;
                },
                response: function (response) {
                    return response;
                },
                responseError: function (rejection) {
                    var requestNamespace = rejection.config[namespacePropName];
                    if (typeof requestNamespace !== 'undefined') {
                        errorService.addErrors(requestNamespace, rejection.data.errors);
                    }
                    return $q.reject(rejection);
                }
            };
        }]);
})();
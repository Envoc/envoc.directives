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
                        var errors = parseResponseErrors(rejection.data);
                        errorService.addErrors(requestNamespace, errors);
                    }
                    return $q.reject(rejection);
                }
            };
        }]);

    /**
     * Retrieves the array of errors from the response and converts them to our preferred form.
     * Change this function if the server doesnt return an envoc standard response like this: 
     *  { errors:[{PropertyName:"",ErrorMessage:"" }] }
     * 
     */
    function parseResponseErrors(response) {
        return response.Errors.map(function (err) {
            return {
                propertyName: err.PropertyName,
                errorMessage: err.ErrorMessage
            };
        });
    }
})();
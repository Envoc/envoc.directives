(function () {
    'use strict';
    angular
        .module('envoc')
        .service('errorService', ['$timeout', function errorService($timeout) {
            function service() {
                var srvc = this;
                srvc.errors = {};

                srvc.clear = function () {
                    srvc.errors = {};
                };

                srvc.clearNamespace = function (namespace) {
                    srvc.errors[namespace] = {};
                };

                srvc.addErrors = function (namespace, errors) {
                    $timeout(function () {
                        srvc.clearNamespace(namespace);
                        errors.forEach(function (err) {
                            srvc.errors[namespace][err.propertyName] = err;
                        });
                    });
                };
            }
            return new service();
        }]);
})();
(function () {
    'use strict';
    angular
        .module('envoc')
        .factory('noCacheInterceptor', [function () {
            return {
                request: function (config) {
                    if (config.method == 'GET' && config.url.indexOf(".html") == -1) {
                        var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                        config.url = config.url + separator + 'c=' + new Date().getTime();
                    }
                    return config;
                }
            };
        }]);
})();
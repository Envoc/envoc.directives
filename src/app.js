(function() {
    'use strict';

    angular.module('envoc', ['ui.bootstrap.pagination'])
    	.value('defaultNamespace', 'root')
        .value('namespacePropName', '__namespace')
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('errorNamespacingHttpInterceptor');
            $httpProvider.interceptors.push('noCacheInterceptor');
        }]);
})();
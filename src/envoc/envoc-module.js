(function () {
    angular
        .module('envoc', [])
        .value('defaultNamespace', 'root')
        .value('namespacePropName', '__namespace')
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('errorNamespacingHttpInterceptor');
            $httpProvider.interceptors.push('noCacheInterceptor');
        }]);
})();
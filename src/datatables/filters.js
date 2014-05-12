(function() {
    'use strict';

    var app = angular.module('envoc.directives.datatables');

    app.filter('startFrom', function() {
        return function(input, start) {
            if (input === undefined) {
                return input;
            } else {
                return input.slice(+start);
            }
        };
    });
    
})();

var app = angular.module('example.datatables', ['envoc.directives']);

app.controller('MainCtrl', function($timeout) {
    var viewModel = this;

    
    viewModel.config = {
        dataSrc: []
    };

    init();

    function init() {
        _.times(100, function(n){
            viewModel.config.dataSrc.push({ id: n, name: (n%2==1?'john':'bob'), position: ':{ PM ===>' });
        });
    }
});
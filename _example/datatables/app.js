var app = angular.module('example.datatables', ['envoc.directives']);

app.controller('MainCtrl', function($timeout) {
    var viewModel = this;

    
    viewModel.config = {
        dataSrc: []
    };

    init();

    function init() {
        _.times(20, function(n){
            viewModel.config.dataSrc.push({ id: n, name: 'john', position: ':{ PM ===>' });
        });
    }
});
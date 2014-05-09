var app = angular.module('example.datatables', ['envoc.directives']);

app.controller('MainCtrl', function($timeout) {
    var viewModel = this;

    
    viewModel.config = {
        dataSrc: [
            {id: 1, name: 'bob', position: 'developer'},
            { id: 2, name: 'john', position: ':{ PM ===>' }
        ]
    };

    init();

    function init() {
        $timeout(function () {
            viewModel.config.dataSrc.push({
                id: viewModel.config.dataSrc.length + 1,
                name: 'other',
                position: 'who cares'
            });
        }, 1000);
    }
});
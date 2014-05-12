var app = angular.module('example.datatables', ['envoc.directives']);

app.controller('MainCtrl', function() {
    var viewModel = this;

    viewModel.config = {
        dataSrc: []
    };

    init();

    function init() {
        _.times(33, function(n){
            viewModel
                .config
                .dataSrc
                .push({
                    id:n+1, 
                    name:'User '+ n, 
                    position: 'Developer Level ' + (n+1)
                });
        })
    }
});
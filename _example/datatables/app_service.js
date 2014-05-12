var app = angular.module('example.datatables', ['envoc.directives']);

app.controller('MainCtrl', function(FakeService) {
    var viewModel = this;

    
    viewModel.config = {
        fetchMethod: FakeService.fetch
    };

    viewModel.config2 = {
        dataSrc: []
    };

    init();

    function init() {
        _.times(33, function(n){
            viewModel.config2.dataSrc.push({id:n+1, name:'User '+ n, position: 'Developer Level ' + (n+1)});
        })
    }
});

app.service('FakeService', function($q) {
    var self = this;

    var httpResponse1 = {
        "iTotalRecords": 4,
        "iTotalDisplayRecords": 4,
        "aaData": [
            [4, "\/Date(1383171547680)\/", null, "No", 4],
            [3, "\/Date(1383171098853)\/", "\/Date(1383171394617)\/", "Yes", 1],
            [2, "\/Date(1383171098853)\/", "\/Date(1383171394617)\/", "Yes", 1],
            [1, "\/Date(1383171098853)\/", "\/Date(1383171394617)\/", "Yes", 1]
        ],
        "sColumns": "Id,StartDateUtc,EndDateUtc,IsClosed,RegistrationCount"
    }

    this.fetch = function(stateOfTheWorld){
        console.log(stateOfTheWorld);
        return $q.when({data:httpResponse1});
    }
});
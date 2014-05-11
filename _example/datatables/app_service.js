var app = angular.module('example.datatables', ['envoc.directives']);

app.controller('MainCtrl', function(FakeService) {
    var viewModel = this;

    
    viewModel.config = {
        fetchMethod: FakeService.fetch
    };

    init();

    function init() {
        
    }
});

app.service('FakeService', function($q) {
    var self = this;

    var httpResponse1 = {
        "iTotalRecords": 2,
        "iTotalDisplayRecords": 2,
        "aaData": [
            [2, "\/Date(1383171547680)\/", null, "No", 4],
            [1, "\/Date(1383171098853)\/", "\/Date(1383171394617)\/", "Yes", 1]
        ],
        "sColumns": "Id,StartDateUtc,EndDateUtc,IsClosed,RegistrationCount"
    }

    this.fetch = function(stateOfTheWorld){
        return $q.when({data:httpResponse1});
    }
});
var app = angular.module('example.datatables', ['envoc.directives']);

app.controller('MainCtrl', function(FakeService) {
    var viewModel = this;

    
    viewModel.config = {
        fetchMethod: FakeService.fetch,
        linesPerPage: 2,
        throttle: 301,
        saveState: 'config'
    };

    viewModel.config2 = {
        dataSrc: [],
        linesPerPage: 5,
        paginationSettings: {
            maxSize:2
        },
        saveState: 'config2'
    };

    viewModel.parseDate = function(input){
        return new Date(parseInt(input.substring(6)));
    };

    init();

    function init() {
        _.times(33, function(n){
            viewModel
                .config2
                .dataSrc
                .push({
                    id:n+1, 
                    name:'User '+ n, 
                    position: 'Developer Level ' + (n+1)
                });
        })
    }
});

app.service('FakeService', function($q, $filter) {
    var self = this;
    var search = $filter('filter');

    var data = [
        [1, "\/Date(1383171098853)\/", "Joe", "Yes", 1],
        [2, "\/Date(1383171098853)\/", "Joey", "Yes", 1],
        [3, "\/Date(1383171098853)\/", "Jane", "Yes", 1],
        [4, "\/Date(1383171547680)\/", "Bob", "No", 4],
        [5, "\/Date(1383171547680)\/", "Sarah", "No", 4],
        [6, "\/Date(1383171547680)\/", "Adrian", "No", 4],
        [7, "\/Date(1383171547680)\/", "Sam", "No", 4],
        [8, "\/Date(1383171547680)\/", "Sally", "No", 4],
        [9, "\/Date(1383171547680)\/", "Justin", "No", 4]
    ]

    this.fetch = function(stateOfTheWorld){
        console.log(stateOfTheWorld);

        var cache = _.clone(data);

        if(stateOfTheWorld.AllSearch){
            cache = search(cache, stateOfTheWorld.AllSearch);
        }

        var dfd = $q.defer();

        setTimeout(function () {
            dfd.resolve({
                data: {
                    "iTotalRecords": data.length,
                    "iTotalDisplayRecords": cache.length,
                    "aaData": _.take(_.rest(cache, stateOfTheWorld.Skip), parseInt(stateOfTheWorld.Take, 10)),
                    "sColumns": "Id,StartDateUtc,Name,IsClosed,RegistrationCount"
                }
            });
        }, 3000);

        return dfd.promise;
    }
});

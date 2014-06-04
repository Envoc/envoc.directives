var app = angular.module('example.datatables', ['envoc.directives']);

app.controller('MainCtrl', function() {
    var viewModel = this;

    viewModel.config = {
        dataSrc: [],
        linesPerPage:5
    };

    init();

    function init() {
        _.times(33, function(n){
            viewModel
                .config
                .dataSrc
                .push({
                    id:n+1, 
                    image: 'http://lorempixel.com/640/480/people/9/', 
                    date: Faker.Date.recent(999),
                    tags: Faker.Lorem.words(),
                    title: Faker.Lorem.sentence(),
                    summary: Faker.Lorem.paragraph()
                });
        })
    }
});
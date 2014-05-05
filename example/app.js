var app = angular.module('plunker', ['envoc.directives']);

app.controller('MainCtrl', function ($timeout) {
    var viewModel = this;

    // fake gettings errors back from an api in this format
    viewModel.submit = function () {
        viewModel.action = 'Submitting...';

        $timeout(function () {
            viewModel.errors = [
              { propertyName: '', type: 'length', message: 'This is global' },
              { propertyName: '', type: 'length', message: 'This is global also' },
              { propertyName: 'firstName', type: 'required', message: 'First Name is required' },
              { propertyName: 'firstName', type: 'length', message: 'First Name must be between 2 and 256 characters' },
              { propertyName: 'lastName', type: 'length', message: 'Last Name must be between 2 and 256 characters' }
            ];

            viewModel.action = 'Submitting';

        }, 750);
    };

    init();
    function init() {
        viewModel.action = 'Submitting';
    }
});
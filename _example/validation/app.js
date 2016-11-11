var app = angular.module('example.validation', ['envoc']);

app.controller('MainCtrl',[ '$timeout', 'apiClient', 'errorService',  function($timeout, apiClient, errorService) {
    var viewModel = this;

    // fake gettings errors back from an api in this format
    viewModel.submit = function() {
        viewModel.action = 'Submitting...';

        //apiClient.get('url').then(function(response){
            //At this point the errors are already set in the errorService by the error-namespacing http interceptor
        //});

        errorService.clear()

        $timeout(function() {
            var errors = [
                {
                    propertyName: '',
                    errorMessage: 'This is global'
                }, {
                    propertyName: '',
                    errorMessage: 'This is global also'
                }, {
                    propertyName: 'firstName',
                    errorMessage: 'First Name is required'
                }, {
                    propertyName: 'firstName',
                    errorMessage: 'First Name must be between 2 and 256 characters'
                }, {
                    propertyName: 'lastName',
                    errorMessage: 'I hate you'
                }, {
                    propertyName: 'lastName',
                    errorMessage: 'No, but really'
                }];

            errorService.addErrors('root', errors);

            viewModel.action = 'Submit';

            viewModel.modelState = {
                "id": {
                    "value": {
                        "attemptedValue": "12",
                        "culture": "en-US",
                        "rawValue": 12
                    },
                    "errors": []
                },
                "firstName": {
                    "value": {
                        "attemptedValue": "",
                        "culture": "en-US",
                        "rawValue": ""
                    },
                    "errors": [{
                        "errorMessage": "First Name is required."
                    }]
                },
                "lastName": {
                    "value": {
                        "attemptedValue": "",
                        "culture": "en-US",
                        "rawValue": ""
                    },
                    "errors": [{
                        "errorMessage": "Last Name is required."
                    }]
                },
                "middleInitial": {
                    "value": {
                        "attemptedValue": "s",
                        "culture": "en-US",
                        "rawValue": "s"
                    },
                    "errors": []
                }
            };

        }, 750);
    };

    init();

    function init() {
        viewModel.action = 'Submit';
    }
}]);

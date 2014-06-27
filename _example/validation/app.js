var app = angular.module('example.validation', ['envoc.directives.validation']);

// comment me out to see default template
//app.run([
//    '$templateCache', function ($templateCache) {
//        $templateCache.put('/oTemplates/validation/oValidationMessageFor.tmpl.html',
//            '﻿<div>\n' +
//            '    <div ng-transclude></div>\n' +
//            '    <pre ng-show="matches.length" ng-repeat="error in matches">{{error|json}}</pre>\n' +
//            '</div>');
//    }
//]);

app.controller('MainCtrl', function($timeout) {
    var viewModel = this;

    // fake gettings errors back from an api in this format
    viewModel.submit = function() {
        viewModel.action = 'Submitting...';

        $timeout(function() {
            viewModel.errors = [
                {
                    propertyName: '',
                    type: 'length',
                    errorMessage: 'This is global'
                }, {
                    propertyName: '',
                    type: 'length',
                    errorMessage: 'This is global also'
                }, {
                    propertyName: 'firstName',
                    type: 'required',
                    errorMessage: 'First Name is required'
                }, {
                    propertyName: 'firstName',
                    type: 'length',
                    errorMessage: 'First Name must be between 2 and 256 characters'
                }, {
                    key: 'lastName',
                    message: 'I hate you'
                }, {
                    key: 'lastName',
                    message: 'No, but really'
                }
            ];

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
});

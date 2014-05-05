var app = angular.module('plunker', ['envoc.directives']);

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
                { propertyName: '', type: 'length', errorMessage: 'This is global' },
                { propertyName: '', type: 'length', errorMessage: 'This is global also' },
                { propertyName: 'firstName', type: 'required', errorMessage: 'First Name is required' },
                { propertyName: 'firstName', type: 'length', errorMessage: 'First Name must be between 2 and 256 characters' },
                { propertyName: 'lastName', type: 'length', errorMessage: 'Last Name must be between 2 and 256 characters' }
            ];

            viewModel.action = 'Submit';

        }, 750);
    };

    init();

    function init() {
        viewModel.action = 'Submit';
    }
});
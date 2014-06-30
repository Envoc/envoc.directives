![Travis Status](http://img.shields.io/travis/Envoc/envoc.directives.svg?style=flat) 
&nbsp;
![NuGet Version](http://img.shields.io/nuget/v/Envoc.Directives.svg?style=flat)

Envoc Directives
====

This is going to be a home for a common set of AngularJS
directives that can be reused throught projects.

Prefix all directives with o

Example:

```
<div o-validation-message-for="firstName"></div>
```

Installing
----

This will install all `node_modules` and `bower_components` needed

`
npm install
`

Building
----

This will run the concatenation build script and inline all html templates
into the template cache.

`
gulp
`

Project Use
----

`Install-Package Envoc.Directives`

*****

Directives
====

oTable
----

https://github.com/Envoc/envoc.directives/blob/master/src/datatables/discovery.md

oValidateWith
----

* Used as wrapper to map child validation messages to keys bound to error property
* Child directive __oValidationMessageFor__ maps propertyName of error object in collection
* Child directive __oValidationSummary__ displays a validation summary

```
<div o-validate-with errors="ctrl1.errors">
	<div o-validation-summary></div>
    <div o-validation-message-for="firstName"></div>
    <div o-validation-message-for="lastName"></div>
</div>
```

__where ctrl1.errors:__

```
[
    { propertyName: '', type: 'length', errorMessage: 'This is global' },
    { propertyName: 'firstName', type: 'required', errorMessage: 'First Name is required' },
    { 
        propertyName: 'lastName', 
        type: 'length', 
        errorMessage: 'Last Name must be between 2 and 256 characters' 
    }
];

```

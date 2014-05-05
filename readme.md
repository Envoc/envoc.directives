Envoc Directives
====

This is going to be a home for a common set of AngularJS
directives that can be reused throught projects.

Prefix all directives with o

Example:
<pre>
&lt;div class="form-group" o-validation-message-for="firstName"&gt;&lt;/div&gt;
</pre>

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

Directives
----

* oValidateWith
    * oValidationMessageFor
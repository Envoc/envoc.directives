envoc.directives.datatables
====

Goal
----

To build an angular replacement for jQuery datatables that will 
act as a client-side drop in replacement.

* Build on Envoc.Core datatables server code (filtering/sorting/paging)
* Give Envoc designers complete freedom in UI/UX

__Possible Directives:__
* oTable
    * oTableRepeat
        * oTableColumn
    * oTableFilter
    * oTableColumnFilter
    * oTableColumnSort
    * oTablePagination

```html
<div o-table>
    <input type="text" o-table-filter/>
    <select o-table-column-filter key="jobPosition">
        <option value="developer"></option>
        <option value="is there anything else?"></option>
    </select>
    <table>
        <thead>
            <tr>First Name</tr>
            <tr>Full Name</tr>
            <tr>Job Position</tr>
        </thead>
        <tbody>
            <tr o-table-repeat>
                <td o-table-column key="firstName" o-table-column-sort></td>
                <td o-table-column key="fullName()"></td>
                <td o-table-column key="jobPosition"></td>
            </tr>
        </tbody>
    </table>
    <div o-table-pagination config="configObj"></div>
</div>
```

```html
<div o-table>
    <input type="text" o-table-filter/>
    <select o-table-column-filter key="jobPosition">
        <option value="developer"></option>
        <option value="is there anything else?"></option>
    </select>
    <div o-table-repeat>
        <div o-table-column key="firstName" o-table-column-sort></div>
        <div o-table-column key="fullName()"></div>
    </div>
    <div o-table-column-sort key="firstName">Sort By First Name</div>
    <div o-table-pagination config="configObj"></div>
</div>
```
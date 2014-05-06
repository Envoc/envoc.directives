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
    * oTablePaginationPrevious (I don't know how I feel about these yet)
    * oTablePaginationNext

__Possible Use Cases__

```html
<div o-table config="dataSrc1Config">
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
<div o-table config="dataSrc2Config">
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

__All directive live under the oTable directive__

oTable
----

__oTableCtrl:__

* Will be bound to the config object responsible for server communication
    * Should this be a config object or just enumerable Angular Expression?
    * Thinking config to mimic response similar to datatables response
* Will contain the main event bus upon which events such as pagination will be routed through
* Proposed State Properties
    * DataSrc
    * DataSrcUrl
    * SearchText
    * ColumnSortArray
    * ColumnFilterArray
    * Pagination (See pagination below)

oTableRepeat
----

Essentially just a `ng-repeat` that will contain `o-table-column` directives

oTableColumn
----

* Needs to handle both object properties and computed properties
* Computed properties - When the server gets the json response, it can decorate each row

oTableFilter
----

Will set the search property of the oTableCtrl

oTableColumnFilter
----

Will set column filter properties of the oTableCtrl

oTableColumnSort
----

Will set column sort properties of the oTableCtrl

oTablePagination
----

* These just need to emit events that can be caught by oTableCtrl.
* Should this be able to set a querystring for back-button?

_look into ui-bootstrap pagination_

* Pagination should track:
    * CurrentPage
    * PageSize
    * TotalRowCount (FilteredRowCount from server response)

oTablePaginationPrevious && oTablePaginationNext
----

These just need to emit events that can be caught by oTableCtrl

*****

Server Side Notes
----

__Response Structure__

* I think actual data needs to be in an Array of Objects for simplicity.
* Proposed Properties
    * UnfilteredRowCount
    * FilteredRowCount
    * PageData

```javascript
{
    UnfilteredRowCount: 100,
    FilteredRowCount: 1,
    PageData: [
        {
            id: 1,
            firstName: 'Justin',
            lastName: 'Obney',
            position: 'Developer'
        }
    ]
}
```
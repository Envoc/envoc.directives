envoc.directives.datatables
====

Goal
----

To build an angular replacement for jQuery datatables that will 
act as a client-side drop in replacement.

* Build on Envoc.Core datatables server code (filtering/sorting/paging)
* Give Envoc designers complete freedom in UI/UX

### Possible Directives:

* oTable
    * oTableRepeat
        * oTableColumn
    * oTableFilter
    * oTableColumnFilter
    * oTableColumnSort
    * oTablePagination
    * oTablePaginationPrevious (I don't know how I feel about these yet)
    * oTablePaginationNext

### Possible Use Cases

__Default__

```html
<div o-table config="dataSrc1Config">
    <div o-table-default fields="id, firstName, lastName, position"></div>
</div>
```

```html
<div o-table config="dataSrc1Config">
    <input type="text" o-table-filter/>
    <select o-table-column-filter field="jobPosition">
        <option value="developer"></option>
        <option value="is there anything else?"></option>
    </select>
    <table>
        <thead>
            <tr o-table-column-sort field="firstName">First Name</tr>
            <tr>Full Name</tr>
            <tr>Job Position</tr>
        </thead>
        <tbody>
            <tr o-table-repeat>
                <td o-table-column field="firstName"></td>
                <td o-table-column field="fullName()"></td>
                <td o-table-column field="jobPosition"></td>
            </tr>
            <!-- OR: Usgin ng-repeat -->
            <tr ng-repeat="row in rows">
                <td>{{row.firstName}}</td>
                <td>{{row.fullName()}}</td>
                <td>{{row.jobPosition}}</td>
            </tr>
        </tbody>
    </table>
    <div o-table-pagination config="configObj"></div>
</div>
```

```html
<div o-table config="dataSrc2Config">
    <input type="text" o-table-filter/>
    <select o-table-column-filter field="jobPosition">
        <option value="developer"></option>
        <option value="is there anything else?"></option>
    </select>
    <div o-table-repeat>
        <div o-table-column field="firstName"></div>
        <div o-table-column field="fullName()"></div>
    </div>
    <div o-table-column-sort field="firstName">Sort By First Name</div>
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
* Maybe have an overridable `fetchData` method that will be given stateParams and expected to return a promise

oTableRepeat
----

* Essentially just a `ng-repeat` that will contain `o-table-column` directives
* Default action is to just repeat using the `field="propName"` notation
* Maybe not required to allow a more custom actual ng-repeat implimentation in the view

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

* Will set column sort properties of the oTableCtrl
* Will add prospective sort-state css-classes: `sortable sort-asc sort-desc`

oTablePagination
----

* These just need to emit events that can be caught by oTableCtrl.
* Should this be able to set a querystring for back-button?

_look into ui-bootstrap pagination_

* Pagination should track:
    * CurrentPage
    * PageSize
    * TotalRowCount (FilteredRowCount from server response)

oTablePaginationPrevious & oTablePaginationNext
----

These just need to emit events that can be caught by oTableCtrl

*****

Server Side Notes
----

__Response Structure__

__Update:__
*After talking with Matthew, I am going to aim for the current Datatable response,
to make sure the same server side classes can handle both angular and non-angular
implementations*

* ~~I think actual data needs to be in an Array of Objects for simplicity.~~
* Proposed Properties - *Phase 2*
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

__Existing Request Structure__
```
TableEcho:10
Skip:0
Take:25
AllSearch:1
Columns[0].ColumnIndex:1
Columns[0].SortDirection:asc
Columns[1].ColumnIndex:2
Columns[1].SortDirection:asc
Columns[2].ColumnIndex:3
Columns[2].SortDirection:desc
```

__Existing Response Structure__ `class FormattedList`

```
{
    "sEcho": 1,
    "iTotalRecords": 2,
    "iTotalDisplayRecords": 2,
    "aaData": [
        [2, "\/Date(1383171547680)\/", null, "No", 4],
        [1, "\/Date(1383171098853)\/", "\/Date(1383171394617)\/", "Yes", 1]
    ],
    "sColumns": "Id,StartDateUtc,EndDateUtc,IsClosed,RegistrationCount"
}
```
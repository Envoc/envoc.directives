(function(module) {
try {
  module = angular.module('envoc.directives.partials');
} catch (e) {
  module = angular.module('envoc.directives.partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/oTemplates/datatables/oTableDefault.tmpl.html',
    '<div class="dataTables_wrapper form-inline" role="grid">\n' +
    '    <div class="row">\n' +
    '        <div class="span6 pull-left">\n' +
    '            <div class="dataTables_length">\n' +
    '                <label>\n' +
    '                    Show\n' +
    '                    <select size="1" aria-controls="user-table">\n' +
    '                        <option value="10" selected="selected">10</option>\n' +
    '                        <option value="25">25</option>\n' +
    '                        <option value="50">50</option>\n' +
    '                        <option value="100">100</option>\n' +
    '                    </select>\n' +
    '                    entries\n' +
    '                </label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="span6 pull-right">\n' +
    '            <div class="dataTables_filter">\n' +
    '                <label>\n' +
    '                    Search:\n' +
    '                    <input type="text" aria-controls="user-table">\n' +
    '                </label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <table class="table table-striped dataTable" aria-describedby="user-table_info">\n' +
    '        <thead>\n' +
    '            <tr role="row"></tr>\n' +
    '        </thead>\n' +
    '\n' +
    '        <tbody role="alert" aria-live="polite" aria-relevant="all">\n' +
    '            <tr ng-repeat="row in rows">\n' +
    '            </tr>\n' +
    '        </tbody>\n' +
    '    </table>\n' +
    '\n' +
    '    <div class="row">\n' +
    '        <div class="span6 pull-left">\n' +
    '            <div class="dataTables_info" id="user-table_info">Showing 1 to 4 of 4 entries</div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="span6 pull-right">\n' +
    '            <div class="dataTables_paginate paging_bootstrap">\n' +
    '                <ul class=" pagination">\n' +
    '                    <li class="prev disabled">\n' +
    '                        <a href="#">← Previous</a>\n' +
    '                    </li>\n' +
    '                    <li class="active">\n' +
    '                        <a href="#">1</a>\n' +
    '                    </li>\n' +
    '                    <li class="next disabled">\n' +
    '                        <a href="#">Next → </a>\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

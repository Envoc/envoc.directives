angular.module('envoc.directives.confirm')
  .directive('confirm', function($http, $compile, $templateCache, $document, $timeout) {
      return {
        scope: {
          'message': '@',
          'confirm': '&'
        },
        link: function(scope, element, attr) {
          var html;
          var uuid = uuid();

          element.attr('data-uuid', uuid);
          scope.actionClass = attr.confirmationClass || 'btn-danger';

          $http.get('/oTemplates/confirm/confirm.tmpl.html'), {
            cache: $templateCache
          }).success(function(tplContent) {
            html = tplContent;
            createPopover(scope.message);
          });

          scope.$watch('message', function(current) {
            if (current)
              createPopover(current);
          });

          scope.cancel = function() {
            element.popover('hide');
          };

          var action = scope.confirm;

          scope.confirm = function() {
            element.popover('destroy');
            action();
          };

          $document.on('show.bs.popover', '#ng-app', function(e) {
            if (!angular.element(e.target).is(element)) {
              element.popover('hide');
            }
          });

          $document.on('click', 'body', function(e) {
            if (!angular.element(e.target).is(element) && angular.element(element).find(e.target).length < 1) {
              element.popover('hide');
            }
          });

          scope.$on('$destroy', function() {
            angular.element('[data-uuid="' + uuid + '"]').closest('.popover').remove();
            element.popover('destroy');
            $document.off('show.bs.popover');
          });

          function createPopover(message) {
            if (!html) return;
            element.popover('destroy');
            element.popover({
              title: message,
              html: true,
              content: function() {
                var content = $compile(html)(scope);
                content.attr('data-uuid', uuid);
                $timeout(function() {
                  element.data()['bs.popover'].options.content = content;
                });
                return content;
              },
              placement: 'auto bottom',
              container: 'body'
            });
          }

          function uuid() {
            return _p8() + _p8(true) + _p8(true) + _p8();

            function _p8(s) {
              var p = (Math.random().toString(16) + "000000000").substr(2, 8);
              return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }
          }
        }
      }
  });

angular.module('envoc')
  .filter('startFrom', function() {
      return function(input, start) {
          if (input === undefined) {
              return input;
          } else {
              return input.slice(+start);
          }
      };
  });
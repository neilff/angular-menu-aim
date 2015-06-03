'use strict';

angular.module('app', [
  'neilff.flyout-tpls',
  'app.controllers'
]);

angular.module('app.controllers', [])
  .controller('MainController', function($scope, $http) {

    /**
     * read JSON menu data
     */
    $http.get('departments.json').then(handleResponse, handleResponse);

    /**
     * Function to toggle the flyout
     *
     * @method toggleFlyout
     * @return {undefined} undefined
     */
    function toggleFlyout() {
      $scope.flyoutReveal = !$scope.flyoutReveal;
    }

    function handleResponse(response) {
      /**
       * Attach scope methods and properties
       */
      angular.extend($scope, {
        flyoutReveal: false,
        toggleFlyout: toggleFlyout,
        exitMenu: angular.noop,
        enterRow: angular.noop,
        activateRow: angular.noop,
        departments: response.data
      });
    }
  });

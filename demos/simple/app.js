'use strict';

angular.module('app', [
  'neilff.flyout-tpls',
  'app.controllers'
]);

angular.module('app.controllers', [])
  .controller('MainController', function($scope) {

    /**
     * Create some sample categories
     *
     * @type {Array}
     */
    var categories = [
      'Bedding',
      'Buckwheat',
      'Oranges',
      'Blue',
      'Cars',
      'Trucks',
      'Dogs',
      'Cats',
      'Iguana',
      'Crocodile',
      'Green',
      'Black',
      'White',
      'Gray'
    ];

    /**
     * Build them into lovely objects
     *
     * @method buildCategoryArray
     * @param  {Integer} num How many categories
     * @return {Array} Array of objects
     */
    function buildCategoryArray(num) {
      var array = new Array(num);

      for (var i = array.length - 1; i >= 0; i--) {
        array[i] = {
          name: _.sample(categories)
        };
      }

      return array;
    }

    /**
     * Function to toggle the flyout
     *
     * @method toggleFlyout
     * @return {undefined} undefined
     */
    function toggleFlyout() {
      $scope.flyoutReveal = !$scope.flyoutReveal;
    }

    /**
     * Attach scope methods and properties
     */
    angular.extend($scope, {
      flyoutReveal: false,
      toggleFlyout: toggleFlyout,
      categories: buildCategoryArray(8)
    });
  });

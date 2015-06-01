'use strict';

angular.module('app', [
  'neilff.flyout-tpls',
  'app.controllers'
]);

angular.module('app.controllers', [])
  .controller('MainController', function($scope) {

    /**
     * Create some sample departments; read this from external resource in production application
     *
     * @type {Array}
     */
    var departments = [
        {
          name: 'Books',
          img: null,
          categories: [
            {
              name: 'Fiction',
              link: 'fiction',
              subcategories: [
                {
                  name: 'Suspense',
                  link: 'fiction/suspense'
                }
              ]
            }
          ]
        },
        {name: 'Movies'},
        {name: 'Home'},
        {name: 'Health'},
        {name: 'Toys'}
      ];

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
      exitMenu: $.noop,
      enterRow: $.noop,
      activateRow: $.noop,
      departments: departments
    });
  });

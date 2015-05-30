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
        {name: 'Patas', img: 'img/patas.png'},
        {name: 'Golden Snub-Nosed', img: 'img/snub-nosed.png'},
        {name: 'Duoc Langur', img: 'img/duoc-langur.png'},
        {name: 'Baby Pygmy Marmoset', img: 'img/pygmy.png'},
        {name: 'Black Lion Tamarin', img: 'img/tamarin.png'},
        {name: 'Monk Saki', img: 'img/monk.png'},
        {name: 'Gabon Talapoin', img: 'img/gabon.png'},
        {name: 'Grivet', img: 'img/grivet.png'},
        {name: 'Red Leaf', img: 'img/red-leaf.png'},
        {name: 'King Colobus', img: 'img/colobus.png'}
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
      categories: categories
    });
  });

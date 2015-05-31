'use strict';

/**
 * This directive will render the desktop flyout menu. It uses the
 * jquery-menu-aim plugin, and converts it to a more friendlier Angular
 * implementation. Refer to the original plugin here:
 *
 * https://github.com/kamens/jQuery-menu-aim
 */
angular
  .module('template/flyout/flyout.html', [])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('template/flyout/flyout.html',
      '<div class="flyout-navigation"' +
        'ng-class="{\'reveal\': flyoutCtrl.isVisible()}"' +
        'ng-mouseleave="flyoutCtrl.mouseleaveMenu();">' +
        '<ul class="flyout-dropdown list-unstyled"' +
          'role="menu"' +
          'ng-transclude>' +
        '</ul>' +
      '</div>'
    );
  }]);

angular
  .module('template/flyout/flyout-item.html', [])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('template/flyout/flyout-item.html',
      '<li class="flyout-list-item" ng-transclude></li>'
    );
  }]);

angular
  .module('template/flyout/flyout-popover.html', [])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('template/flyout/flyout-popover.html',
      '<div class="{{ getSelector() }}"' +
        'ng-class="{\'reveal\': getActiveRow() === $index}"' +
        'ng-transclude>' +
      '</div>'
    );
  }]);

angular
  .module('template/flyout/flyout-link.html', [])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('template/flyout/flyout-link.html',
      '<a href="" ng-mouseenter="mouseenterRow($index)" ng-mouseleave="mouseleaveRow($index)" ng-click="clickRow($index);" ng-transclude></a>'
    );
  }]);

angular
  .module('neilff.flyout-tpls', [
    'ng',
    'template/flyout/flyout.html',
    'template/flyout/flyout-item.html',
    'template/flyout/flyout-popover.html',
    'template/flyout/flyout-link.html'
  ])
  .factory('flyoutPopover', [function() {
    return function flyoutPopover(scope, elem, attrs, ctrls) {
      var flyoutCtrl = ctrls[0];

      angular.extend(scope, {
        getActiveRow: flyoutCtrl.getActiveRow,
        getSelector: flyoutCtrl.getSelector
      });
    };
  }])
  .factory('flyoutLink', [function() {
    return function flyoutLink(scope, elem, attrs, ctrls) {
      var flyoutCtrl = ctrls[0];

      angular.extend(scope, {
        mouseenterRow: flyoutCtrl.mouseenterRow,
        mouseleaveRow: flyoutCtrl.mouseleaveRow,
        clickRow: flyoutCtrl.clickRow
      });
    };
  }])
  .factory('menuAim', [function() {
    var mouseLocs = [];
    var MOUSE_LOCS_TRACKED = 3;  // number of past mouse locations to track

    /**
     * Calculate activation delay based on mouse position
     *
     * @method activationDelay
     * @param {Integer} activeRow The currently active row
     * @param {Object} $menu The $element for the menu
     * @param {Object} options Options for the activation delay
     * @return {Integer} Activation delay in MS
     */
    function activationDelay(activeRow, $menu, options) {
      var lastDelayLoc = null;

      if (!activeRow) {
        // If there is no other submenu row already active, then
        // go ahead and activate immediately.
        return 0;
      }

      var offset = $menu.offset();

      var upperLeft = {
        x: offset.left,
        y: offset.top - options.tolerance
      };

      var upperRight = {
        x: offset.left + $menu.outerWidth(),
        y: upperLeft.y
      };

      var lowerLeft = {
        x: offset.left,
        y: offset.top + $menu.outerHeight() + options.tolerance
      };

      var lowerRight = {
        x: offset.left + $menu.outerWidth(),
        y: lowerLeft.y
      };

      var loc = mouseLocs[mouseLocs.length - 1];
      var prevLoc = mouseLocs[0];

      if (!loc) {
        return 0;
      }

      if (!prevLoc) {
        prevLoc = loc;
      }

      if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
        prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
        // If the previous mouse location was outside of the entire
        // menu's bounds, immediately activate.
        return 0;
      }

      if (lastDelayLoc &&
          loc.x === lastDelayLoc.x && loc.y === lastDelayLoc.y) {
        // If the mouse hasn't moved since the last time we checked
        // for activation status, immediately activate.
        return 0;
      }

      // Detect if the user is moving towards the currently activated
      // submenu.
      //
      // If the mouse is heading relatively clearly towards
      // the submenu's content, we should wait and give the user more
      // time before activating a new row. If the mouse is heading
      // elsewhere, we can immediately activate a new row.
      //
      // We detect this by calculating the slope formed between the
      // current mouse location and the upper/lower right points of
      // the menu. We do the same for the previous mouse location.
      // If the current mouse location's slopes are
      // increasing/decreasing appropriately compared to the
      // previous's, we know the user is moving toward the submenu.
      //
      // Note that since the y-axis increases as the cursor moves
      // down the screen, we are looking for the slope between the
      // cursor and the upper right corner to decrease over time, not
      // increase (somewhat counterintuitively).
      function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
      }

      var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

      // Our expectations for decreasing or increasing slope values
      // depends on which direction the submenu opens relative to the
      // main menu. By default, if the menu opens on the right, we
      // expect the slope between the cursor and the upper right
      // corner to decrease over time, as explained above. If the
      // submenu opens in a different direction, we change our slope
      // expectations.
      if (options.submenuDirection === 'left') {
        decreasingCorner = lowerLeft;
        increasingCorner = upperLeft;
      } else if (options.submenuDirection === 'below') {
        decreasingCorner = lowerRight;
        increasingCorner = lowerLeft;
      } else if (options.submenuDirection === 'above') {
        decreasingCorner = upperLeft;
        increasingCorner = upperRight;
      }

      var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

      if (decreasingSlope < prevDecreasingSlope &&
          increasingSlope > prevIncreasingSlope) {
        // Mouse is moving from previous location towards the
        // currently activated submenu. Delay before activating a
        // new menu row, because user may be moving into submenu.
        lastDelayLoc = loc;
        return options.delay;
      }

      lastDelayLoc = null;
      return 0;
    }

    /**
     * Track the last locations of the mouse
     *
     * @method setMouseLocs
     * @param  {Object} e Event object
     * @return {undefined} undefined
     */
    function setMouseLocs(e) {
      mouseLocs.push({x: e.pageX, y: e.pageY});

      if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
        mouseLocs.shift();
      }
    }

    function getMouseLocs() {
      return mouseLocs;
    }

    return {
      activationDelay: activationDelay,
      setMouseLocs: setMouseLocs,
      getMouseLocs: getMouseLocs
    };
  }])
  .directive('flyoutItem', [function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      templateUrl: 'template/flyout/flyout-item.html'
    };
  }])
  .directive('flyoutLink', ['flyoutLink', function(flyoutLink) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      require: ['^flyoutNavigation'],
      scope: true,
      templateUrl: 'template/flyout/flyout-link.html',
      link: flyoutLink
    };
  }])
  .directive('flyoutPopover', ['flyoutPopover', function(flyoutPopover) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      require: ['^flyoutNavigation'],
      scope: true,
      templateUrl: 'template/flyout/flyout-popover.html',
      link: flyoutPopover
    };
  }])
  .directive('flyoutNavigation', [function() {
    return {
      restrict: 'E',
      scope: {
        visible: '=',
        tolerance: '=',
        delay: '=',
        direction: '=',
        enter: '=',
        exit: '=',
        activate: '=',
        deactivate: '=',
        exitMenu: '=exitmenu',  // Angular treats camel case specially
        selector: '@'
      },
      transclude: true,
      replace: true,
      templateUrl: 'template/flyout/flyout.html',
      controllerAs: 'flyoutCtrl',
      controller: 'FlyoutController'
    };
  }])
  .controller('FlyoutController', ['$element', '$scope', 'menuAim',
    function(
      $element,
      $scope,
      menuAim
    ) {

    $scope.selector = $scope.selector || 'popover';

    var vm = this;
    var elem = $element;
    var $menu = elem.find('.flyout-dropdown');

    (function init() {
      /**
       * Attach document event handlers
       */
      document.addEventListener('mousemove', menuAim.setMouseLocs);

      /**
       * Attach vm methods and properties
       */
      angular.extend(vm, {
        mouseleaveMenu: mouseleaveMenu,
        mouseenterRow: mouseenterRow,
        mouseleaveRow: mouseleaveRow,
        clickRow: clickRow,
        closeMenu: closeMenu,
        openMenu: openMenu,
        getActiveRow: getActiveRow,
        getSelector: getSelector,
        isVisible: isVisible
      });
    })();

    var timeoutId = null;
    var options = {
      submenuDirection: getDirection(),
      tolerance: getTolerance(),
      delay: getDelay(),
      enter: getEnter(),
      exit: getExit(),
      activate: getActivate(),
      deactivate: getDeactivate(),
      exitMenu: getExitMenu()
    };

    var initHeight = false;

    /**
     * Set the popover menu height on the first hover / click
     *
     * @method setPopoverHeight
     * @return {undefined} undefined
     */
    function setPopoverHeight() {
      initHeight = true;
      elem.find('.' + $scope.selector).css('min-height', elem.outerHeight());
    }

    /**
     * Hide menu when user completely exits the menu
     *
     * @method mouseleaveMenu
     * @return {undefined} undefined
     */
    function mouseleaveMenu() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (options.exitMenu(this)) {
        if (vm.activeRow) {
          options.deactivate(vm.activeRow);
        }

        vm.activeRow = null;
      }
    }

    /**
     * Trigger a possible row activation when user enters
     * a new row. If this is first time entering a row,
     * then set the height of the menu.
     *
     * @method mouseenterRow
     * @param  {Integer} row Row index to activate
     * @return {undefined} undefined
     */
    function mouseenterRow(row) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      options.enter(row);
      possiblyActivate(row);
    }

    /**
     * Trigger when user exits a row.
     *
     * @method mouseleaveRow
     * @param  {Integer} row Row index to activate
     * @return {undefined} undefined
     */
    function mouseleaveRow(row) {
      options.exit(row);
    }

    /**
     * Immediately activate a row if user clicks on it.
     * If this is first time entering a row, then set the
     * height of the menu.
     *
     * @method clickRow
     * @param  {Integer} row Row to activate
     * @return {undefined} undefined
     */
    function clickRow(row) {
      activate(row);
    }

    /**
     * Close the menu
     *
     * @method closeMenu
     * @return {undefined} undefined
     */
    function closeMenu() {
      $scope.visible = false;
    }

    /**
     * Open the menu
     *
     * @method openMenu
     * @return {undefined} undefined
     */
    function openMenu() {
      $scope.visible = true;
    }

    /**
     * Active the provided menu row
     *
     * @method activate
     * @param  {Integer} row The row index
     * @return {undefined} undefined
     */
    function activate(row) {
      if (row === vm.activeRow) {
        return;
      }

      if (vm.activeRow) {
        options.deactivate(vm.activeRow);
      }

      options.activate(row);
      vm.activeRow = row;
    }

    /**
     * Possibly activate a row
     *
     * @method possiblyActivate
     * @param  {Integer} row Row index to activate
     * @return {undefined} undefined
     */
    function possiblyActivate(row) {
      var delay = menuAim.activationDelay(vm.activeRow, $menu, options);

      if (delay) {
        timeoutId = setTimeout(function() {
          possiblyActivate(row);
        }, delay);
      } else {
        activate(row);
      }
    }

    /**
     * Returns the currently active row
     *
     * @return {Integer} The currently active row
     */
    function getActiveRow() {
      return vm.activeRow;
    }

    /**
     * Gets the name of the selector used for the popover
     *
     * @return {String} Selector name
     */
    function getSelector() {
      return $scope.selector;
    }

    /**
     * Gets the delay when user appears to be entering submenu
     *
     * @return {Integer} Millisecond delay when user appears to be entering submenu
     */
    function getDelay() {
      return $scope.delay || 1000;
    }

    /**
     * Gets the tolerance forgivey when entering submenu
     *
     * @return {Integer} Amount of forgivey when entering submenu (bigger = more)
     */
    function getTolerance() {
      return $scope.tolerance || 500;
    }

    /**
     * Gets the direction for the submenu
     *
     * @return {String} Direction of submenu (one of: right, left, below, above)
     */
    function getDirection() {
      return $scope.direction || 'right';
    }

    /**
     * Gets callback function to call when a row is entered
     *
     * @return {Function} Callback function to call when row is entered
     */
    function getEnter() {
      return $scope.enter || function() {
          if (!initHeight) {
            setPopoverHeight();
          }
        };
    }

    /**
     * Gets callback function to call when a row is exited
     *
     * @return {Function} Callback function to call when row is exited
     */
    function getExit() {
      return $scope.exit || $.noop;
    }

    /**
     * Gets callback function to call when a row is clicked
     *
     * @return {Function} Callback function to call when row is clicked
     */
    function getActivate() {
      return $scope.activate || function() {
          if (!initHeight) {
            setPopoverHeight();
          }
        };
    }

    /**
     * Gets callback function to call when the menu is exited
     *
     * @return {Function} Callback function to call when menu is exited
     */
    function getExitMenu() {
      return $scope.exitMenu || function() {
          closeMenu();

          return true;
        };
    }

    /**
     * Gets callback function to call when a row is deactivated
     *
     * @return {Function} Callback function to call when row is deactivated
     */
    function getDeactivate() {
      return $scope.deactivate || $.noop;
    }

    /**
     * Returns whether the menu is currently visible or not
     *
     * @return {Boolean} Is the menu visible
     */
    function isVisible() {
      return $scope.visible || false;
    }
  }]);

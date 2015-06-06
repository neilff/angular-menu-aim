/*eslint-disable*/
describe('neilff.flyout', function() {
  var $compile;
  var $rootScope;
  var $httpBackend;
  var $controller;
  var $element;
  var ctrl;
  var menuAim;

  beforeEach(module('neilff.flyout'));

  beforeEach(function () {
    $compile = getService('$compile');
    $rootScope = getService('$rootScope');
    $httpBackend = getService('$httpBackend');
    $controller = getService('$controller');
    menuAim = getService('menuAim');
  });

  beforeEach(function() {
    $httpBackend.whenGET('template/flyout/flyout.html')
      .respond('<div class="flyout-navigation"' +
        'ng-class="{\'reveal\': flyoutCtrl.isVisible()}"' +
        'ng-mouseleave="flyoutCtrl.mouseleaveMenu();">' +
          '<ul class="flyout-dropdown list-unstyled"' +
            'role="menu"' +
            'ng-transclude>' +
          '</ul>' +
        '</div>'
      );

    $httpBackend.whenGET('template/flyout/flyout-item.html')
      .respond('<li class="flyout-list-item" ng-transclude></li>');

    $httpBackend.whenGET('template/flyout/flyout-link.html')
      .respond('<a href="" ng-mouseenter="mouseenterRow($index)" ng-mouseleave="mouseleaveRow($index)" ng-click="clickRow($index);" ng-transclude></a>');

    $httpBackend.whenGET('template/flyout/flyout-popover.html')
      .respond('<div class="{{ getSelector() }}"' +
          'ng-class="{\'reveal\': getActiveRow() === $index}"' +
          'ng-transclude>' +
        '</div>'
      );
  });

  describe('flyoutItem', function() {
    it('should request the flyout-item.html template', function () {
      $httpBackend.expectGET('template/flyout/flyout-item.html');
      $compile('<flyout-item></flyout-item>')($rootScope);
      $httpBackend.flush();
    });
  });

  describe('flyoutPopover', function() {
    it('should request the flyout-popover.html template', function () {
      $httpBackend.expectGET('template/flyout/flyout-popover.html');
      $compile('<flyout-navigation><flyout-popover></flyout-popover></flyout-navigation>')($rootScope);
      $httpBackend.flush();
    });
  });

  describe('flyoutLink', function() {
    it('should request the flyout-link.html template', function () {
      $httpBackend.expectGET('template/flyout/flyout-link.html');
      $compile('<flyout-navigation><flyout-link></flyout-link></flyout-navigation>')($rootScope);
      $httpBackend.flush();
    });
  });

  describe('flyoutNavigation', function() {
    it('should request the flyout.html template', function () {
      $httpBackend.expectGET('template/flyout/flyout.html');
      $compile('<flyout-navigation></flyout-navigation>')($rootScope);
      $httpBackend.flush();
    });
  });

  describe('FlyoutController', function() {
    beforeEach(function() {
      ctrl = $controller('FlyoutController', {
        $scope: $rootScope.$new(),
        $element: $compile(angular.element('<div></div>'))($rootScope)
      });
    });

    it('should exist', function() {
      $rootScope.$digest();

      expect(ctrl, 'FlyoutController').to.be.defined;
      expect(ctrl.mouseleaveMenu, 'FlyoutController.mouseleaveMenu').to.be.defined;
      expect(ctrl.mouseenterRow, 'FlyoutController.mouseenterRow').to.be.defined;
      expect(ctrl.mouseleaveRow, 'FlyoutController.mouseleaveRow').to.be.defined;
      expect(ctrl.clickRow, 'FlyoutController.clickRow').to.be.defined;
      expect(ctrl.closeMenu, 'FlyoutController.closeMenu').to.be.defined;
      expect(ctrl.openMenu, 'FlyoutController.openMenu').to.be.defined;
      expect(ctrl.getActiveRow, 'FlyoutController.getActiveRow').to.be.defined;
      expect(ctrl.getSelector, 'FlyoutController.getSelector').to.be.defined;
      expect(ctrl.isVisible, 'FlyoutController.isVisible').to.be.defined;
    });

    it('should close the menu initially', function() {
      expect(ctrl.isVisible()).to.equal(false);
    });

    it('should provide the default selector', function() {
      expect(ctrl.getSelector()).to.equal('popover');
    });

    it('should open the menu when the openMenu function is called', function() {
      ctrl.openMenu();
      expect(ctrl.isVisible()).to.equal(true);
    });

    it('should close the menu when the closeMenu function is called', function() {
      ctrl.closeMenu();
      expect(ctrl.isVisible()).to.equal(false);
    });

    it('should close the menu when the mouseleaveMenu function is called', function() {
      ctrl.openMenu();
      expect(ctrl.isVisible()).to.equal(true);
      ctrl.mouseleaveMenu();
      expect(ctrl.isVisible()).to.equal(false);
    });

    it('should reveal the popover when the mouseenterRow function is called', function() {
      ctrl.mouseenterRow(0);
      expect(ctrl.getActiveRow()).to.equal(0);
      ctrl.mouseenterRow(1);
      expect(ctrl.getActiveRow()).to.equal(1);
    });

    it('should hide the popover when the mouseleaveRow function is called', function() {
      ctrl.mouseenterRow(0);
      expect(ctrl.getActiveRow()).to.equal(0);
      ctrl.mouseleaveRow(0);
      expect(ctrl.isVisible()).to.equal(false);
    });

    it('should not set the row if a delay is calculated', function() {
      sinon.stub(menuAim, 'activationDelay').returns(1);

      ctrl.mouseenterRow(0);
      expect(ctrl.getActiveRow()).to.equal(undefined);
    });

    it('should set the current row if clicked on', function() {
      ctrl.clickRow(10);
      expect(ctrl.getActiveRow()).to.equal(10);

      ctrl.clickRow(0);
      expect(ctrl.getActiveRow()).to.equal(0);
    });

    it('should return the same value if the row is already selected', function() {
      ctrl.clickRow(10);
      ctrl.clickRow(10);
      expect(ctrl.getActiveRow()).to.equal(10);
    });
  });

  describe('menuAim', function() {
    it('should return the currect mouse locations when getMouseLocs is called', function() {
      var mock = {
        pageX: 0,
        pageY: 1
      };

      var data = menuAim.getMouseLocs();
      expect(data.length).to.equal(0);
    });

    it('should set the currect mouse locations when setMouseLocs is called', function() {
      var mock = {
        pageX: 0,
        pageY: 1
      };

      menuAim.setMouseLocs(mock);

      data = menuAim.getMouseLocs();
      expect(data[0].x).to.equal(mock.pageX);
      expect(data[0].y).to.equal(mock.pageY);
    });

    it('should only store the last 3 mouse locations', function() {
      menuAim.setMouseLocs({pageX: 0, pageY: 1});
      menuAim.setMouseLocs({pageX: 1, pageY: 2});
      menuAim.setMouseLocs({pageX: 3, pageY: 4});
      menuAim.setMouseLocs({pageX: 5, pageY: 6});

      data = menuAim.getMouseLocs();
      expect(data[0].x).to.equal(1);
      expect(data[0].y).to.equal(2);
    });

    it('should return a delay of 0 if there is no active row', function() {
      var data = menuAim.activationDelay();
      expect(data).to.equal(0);
    });

    it('should return a delay of 0 if there is no mouse locations', function() {
      var $menu = angular.element('<div></div>');
      var options = {
        tolerance: 500
      };

      var data = menuAim.activationDelay(1, $menu, options);
      expect(data).to.equal(0);
    });
  });
});

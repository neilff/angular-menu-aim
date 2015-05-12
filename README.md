`develop`
![Circle CI Badge]
(https://circleci.com/gh/neilff/angular-menu-aim/tree/develop.png?circle-token=:circle-token)

`master`
![Circle CI Badge]
(https://circleci.com/gh/neilff/angular-menu-aim/tree/master.png?circle-token=:circle-token)

# angular-menu-aim

`angular-menu-aim` is a AngularJS friendly port of jQuery Menu Aim.

# Installation

```
bower install angular-menu-aim
```

1. Include `build/flyout-tpls.min.js`
2. Link `src/flyout.css` (or copy it into your your own CSS)
3. Include `neilff.flyout-tpls` into your Angular dependencies
4. Use the provided HTML structure

# Usage

```
<flyout-navigation
  visible="myCtrl.flyoutReveal">
  <flyout-item
    ng-repeat="item in categories track by $index">
    <flyout-link>
      {{ item.name }}
    </flyout-link>
    <flyout-popover>
      <p>{{ item.name }}</p>
    </flyout-popover>
  </flyout-item>
</flyout-navigation>
```

# Documentation

###### `<flyout-navigation></flyout-navigation>`

Refers to the wrapper for the navigation menu, supports the following properties:

- `visible {Boolean} (required)` - Is the menu visible or not. Used to trigger menu visiblity from a button.
- `selector {String} (optional)` - CSS selector for the `flyout-item`. Defaults to `popover`.

###### `<flyout-item></flyout-item>`

Acts as a wrapper for each item in the menu. `ng-repeat` over this to build the menu items.

###### `<flyout-link></flyout-link>`

Acts as a wrapper for the item link, this will appear in the menu flyout as the top level navigation items.

###### `<flyout-popover></flyout-popover>`

Acts as a wrapper for the item content, this will appear when a users hovers over a `flyout-item`.

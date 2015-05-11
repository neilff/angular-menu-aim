# angular-menu-flyout

# TODO:

- Add Travis CI
- Add gulp tasks for:
  - changelog
  - test: karma run
  - build: concat, uglify, ngmin
  - dev: watch

# Usage

```
<flyout-navigation
  visible="flyoutReveal">
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

#### `<flyout-navigation></flyout-navigation>`

Refers to the wrapper for the navigation menu

`visible {Boolean} (required)` - Is the menu visible or not. Used to trigger menu visiblity from a button.
`selector {String} (optional)` - CSS selector for the `flyout-item`. Defaults to `popover`.

#### `<flyout-item></flyout-item>`

Acts as a wrapper for each item in the menu. `ng-repeat` over this to build the menu items.

#### `<flyout-link></flyout-link>`

Acts as a wrapper for the item link, this will appear in the menu flyout as the top level navigation items.

#### `<flyout-popover></flyout-popover>`

Acts as a wrapper for the item content, this will appear when a users hovers over a `flyout-item`.

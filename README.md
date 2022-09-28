# tailwind-material-surfaces

[Material Design 3](https://m3.material.io/)'s color system provides a set of guidelines to style buttons and other interactive surfaces.

The guidelines state that for each color that's to be used as a _container color_ of an element, there's a corresponding _on-color_ that will be the default color of content within that element.

There's also rules that define the [interaction states](https://m3.material.io/foundations/interaction-states) of an interactive element based on its _container color_ and _on-color_.

For each pair of _container color_ and _on-color_ defined in your `tailwind.config.js`, this plugin will generate colors and utilities to easily style surfaces and interactive surfaces.

This plugin does not build color themes for you, you can do that with [the official theme builder](https://m3.material.io/theme-builder#/custom).

## Example

Let's say we have a `primary` and `on-primary` color defined in our `tailwind.config.js`.

This plugin will generate:

- `surface-primary` as a shorthand for `bg-primary text-on-primary`.
- some new colors for the interaction states:
  - `primary-hover`: `on-primary` at 8% opacity over `primary`.
  - `primary-press`: `on-primary` at 12% opacity over `primary`.
  - `primary-focus`: `on-primary` at 12% opacity over `primary` (same as `-press`, can be customized if you want a different value).
  - `primary-drag`: `on-primary` at 16% opacity over `primary`.
- `interactive-surface-primary` as a shorthand for `bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-press focus:bg-primary-focus disabled:text-primary/[0.38] disabled:bg-primary/[0.12] transition-colors`. These are the Material 3 styles for buttons and other interactive elements, which can save a lot of boilerplate.

> Note: While the `-drag` color is provided, drag styles should be manually implemented (when required), as that cannot be achieved with pure CSS.

## Installation

```
npm install --save-dev tailwind-material-surfaces
```

### `tailwind.config.js`

```js
module.exports = require('tailwind-material-surfaces')({
  // your usual config
  theme: {
    colors: {
      // colors with an 'on' counterpart will generate surfaces
      primary:  : '#bbffa3',
      on: {
        primary: '#adsfasdf'
        ...
      }
      ...
    }
  }
  ...
});
```

Colors must be provided either as hex values or keywords (no `rgb()` or `hsl()` support yet).

## Why isn't the plugin called in the `plugins` array of `tailwind.config.js`?

`tailwind-mode-aware-colors` modifies your `theme.colors` object to add the new `-hover`, `-press`, `-focus` and `-drag` colors. The Tailwind engine and any other plugins you may be using will then pick those up. Because of that, it needs to wrap your Tailwind configuration and cannot be called in the plugins array.

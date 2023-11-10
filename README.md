![Banner](https://raw.githubusercontent.com/JavierM42/tailwind-material-surfaces/main/image.png)

# tailwind-material-surfaces

[Material Design 3](https://m3.material.io/)'s color system provides a set of guidelines to style buttons and other interactive surfaces.

They state that for each color that's to be used as a _container color_ of an element, there's a corresponding _on-color_: the default color of content within that element.

There's also rules that define the [interaction states](https://m3.material.io/foundations/interaction-states) of an element based on its container color and on-color.

For each pair of container color and on-color defined in the Tailwind config, this plugin will generate colors and utilities for both static and interactive surfaces.

This plugin does not build color themes for you (you can do that with [the official theme builder](https://m3.material.io/theme-builder#/custom)).

## Example

Let's say we have the colors `primary` and `on-primary` defined in our Tailwind config file.

The plugin will generate:

- `surface-primary` as a shorthand for `bg-primary text-on-primary`.
- Some new colors for the interaction states:
  - `primary-hover`, defined as `on-primary` at 8% opacity over `primary`.
  - `primary-press`, defined as `on-primary` at 12% opacity over `primary`.
  - `primary-focus`, defined as `on-primary` at 12% opacity over `primary` (same as `-press`, but can be customized if you want a different value).
  - `primary-drag`, defined as `on-primary` at 16% opacity over `primary`.
- `interactive-surface-primary` as a shorthand for `bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-press focus:bg-primary-focus disabled:text-black/[0.38] disabled:bg-black/[0.12] transition-colors`. These are the Material styles for interactive elements and the main reason to use this plugin.

<!-- TODO image -->

[Here's a CodeSandbox demo](https://codesandbox.io/s/tailwind-material-surfaces-example-4tr3r3?file=/src/App.js) of the plugin in action.

> Note: Even though the `-drag` color is provided, drag styles should be manually implemented (when required), as that cannot be achieved with pure CSS.

> With default settings, make sure to have `black` defined in your Tailwind color palette (it's used for disabled styles).

## How to use it

```
npm install --save-dev tailwind-material-surfaces
```

### `tailwind.config.js`

```js
module.exports = require("tailwind-material-surfaces")({
  // your usual config
  theme: {
    colors: {
      // colors with an 'on' counterpart will generate surfaces
      primary: "#abcd42",
      on: {
        primary: "#123123",
        // ...
      },
      // ...
    },
  },
  // ...
});
```

- You may use `theme.extends.colors` if you want to keep the original Tailwind palette, but the plugin won't work with existing tailwind colors if you only define their corresponding on-color (i.e.: `on-red-200` won't work unless you also overwrite `red-200` in the config).

- Colors must be provided either as hex values or keywords (there's no `rgb()` or `hsl()` support yet).

## Customization

If you wish to customize the default values, you may do so by passing an object as the second argument to the plugin, with any of these keys and your desired values.

```js
require("tailwind-material-surfaces")(
  {
    // tailwind config
  },
  {
    hoverOpacity: 0.08,
    pressOpacity: 0.12,
    focusOpacity: 0.12,
    dragOpacity: 0.16,
    surfacePrefix: "surface", // for example, change to 'sf' if you like shorter names
    interactiveSurfacePrefix: "interactive-surface",
    disabledStyles: {
      textOpacity: 0.38,
      backgroundOpacity: 0.12,
      colorName: "black", // a color name present in your Tailwind palette
      // pass false instead of this object if you don't want disabled styles
    },
    transition: {
      duration: 150, // transition duration in milliseconds
      // pass false instead of this object if you don't want any transition
    },
  }
);
```

You may use `bg` as the `surfacePrefix` if you wish all `bg-X` classes to also set `color: on-X`. You can then overwrite the text color with `text-` utilities. The text color won't be set if you use `bg-X/<alpha-value>` though. You can use `bg-X bg-opacity-<alpha-value>` instead.

## Why isn't the plugin called in the `plugins` array of `tailwind.config.js`?

`tailwind-material-surfaces` modifies your `theme.colors` object to add the new `-hover`, `-press`, `-focus` and `-drag` colors. The Tailwind engine and any other plugins you may be using will then pick those up. Because of that, it needs to wrap your Tailwind configuration and cannot be called in the plugins array.

## Helpers

If for any reason you need to dynamically generate interaction colors, a `getInteractionColors` function is exported.

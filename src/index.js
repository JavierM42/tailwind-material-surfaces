const plugin = require("tailwindcss/plugin");
const chroma = require("chroma-js");
const { over } = require("color-composite");

const DEFAULT_OPTIONS = {
  hoverOpacity: 0.08,
  pressOpacity: 0.12,
  focusOpacity: 0.12,
  dragOpacity: 0.16,
  surfacePrefix: "surface",
  interactiveSurfacePrefix: "interactive-surface",
  disabledStyles: {
    textOpacity: 0.38,
    backgroundOpacity: 0.12,
  },
  transition: {
    duration: 150,
  },
};

// from tailwindcss src/util/flattenColorPalette
const flattenColorPalette = (colors) =>
  Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == "object"
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === "DEFAULT" ? "" : `-${number}`)]: hex,
          }))
        : [{ [`${color}`]: values }]
    )
  );

// mix two colors
const mix = (foregroundColor, backgroundColor, overlayOpacity = 1) => {
  // TODO check if transparent makes sense
  const {
    values: [r, g, b],
  } = over(
    chroma(foregroundColor).alpha(overlayOpacity).hex(),
    backgroundColor
  );
  return `rgb(${r}, ${g}, ${b})`;
};

module.exports = (config, userOptions = {}) => {
  const {
    hoverOpacity,
    pressOpacity,
    focusOpacity,
    dragOpacity,
    surfacePrefix,
    interactiveSurfacePrefix,
    disabledStyles,
    transition,
  } = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };

  const extendsDefaultColors = !config.theme.colors;

  const colors = flattenColorPalette(
    extendsDefaultColors
      ? config.theme.extend.colors || {}
      : config.theme.colors
  );

  Object.keys(colors).forEach((colorName) => {
    const onColorName = `on-${colorName}`;
    const color = colors[colorName];
    const onColor = colors[onColorName];

    if (
      !colorName.startsWith("on-") &&
      chroma.valid(color) &&
      chroma.valid(onColor)
    ) {
      const hoverColor = mix(onColor, color, hoverOpacity);
      const pressColor = mix(onColor, color, pressOpacity);
      const focusColor = mix(onColor, color, focusOpacity);
      const dragColor = mix(onColor, color, dragOpacity);

      colors[`${colorName}-hover`] = hoverColor;
      colors[`${colorName}-press`] = focusColor;
      colors[`${colorName}-focus`] = pressColor;
      colors[`${colorName}-drag`] = dragColor;
    }
  });

  return {
    ...config,
    theme: extendsDefaultColors
      ? { ...config.theme, extend: { ...(config.theme.extend || {}), colors } }
      : { ...(config.theme || []), colors },
    plugins: [
      ...(config.plugins || []),
      plugin(({ addComponents, theme }) => {
        const colors = flattenColorPalette(theme("colors") || {});

        const materialColors = Object.keys(colors).filter(
          (colorName) =>
            colors[`on-${colorName}`] &&
            colors[`${colorName}-hover`] &&
            colors[`${colorName}-focus`] &&
            colors[`${colorName}-press`]
        );

        let newComponents = {};

        materialColors.forEach((colorName) => {
          newComponents[`.${surfacePrefix}-${colorName}`] = {
            [`@apply bg-${colorName}`]: {},
            [`@apply text-on-${colorName}`]: {},
          };

          newComponents[`.${interactiveSurfacePrefix}-${colorName}`] = {
            [`@apply bg-${colorName}`]: {},
            [`@apply text-on-${colorName}`]: {},
            [`@apply hover:bg-${colorName}-hover`]: {},
            [`@apply active:bg-${colorName}-press`]: {},
            [`@apply focus-visible:bg-${colorName}-focus`]: {},
            ...(transition
              ? {
                  [`@apply transition-colors`]: {},
                  [`@apply duration-${transition.duration}`]: {},
                }
              : {}),
            ...(disabledStyles
              ? {
                  [`@apply disabled:text-on-${colorName}/[${disabledStyles.textOpacity}]`]:
                    {},
                  [`@apply disabled:bg-on-${colorName}/[${disabledStyles.backgroundOpacity}]`]:
                    {},
                }
              : {}),
          };
        });

        addComponents(newComponents);
      }, {}),
    ],
  };
};

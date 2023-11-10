const plugin = require("tailwindcss/plugin");
const chroma = require("chroma-js");
const getInteractionColors = require("./getInteractionColors");

const DEFAULT_OPTIONS = {
  surfacePrefix: "surface",
  interactiveSurfacePrefix: "interactive-surface",
  disabledStyles: {
    textOpacity: 0.38,
    backgroundOpacity: 0.12,
    colorName: "black",
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

module.exports = (config, userOptions = {}) => {
  const {
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
      const interactionColors = getInteractionColors(
        color,
        onColor,
        userOptions
      );

      colors[`${colorName}-hover`] = interactionColors.hover;
      colors[`${colorName}-press`] = interactionColors.press;
      colors[`${colorName}-focus`] = interactionColors.focus;
      colors[`${colorName}-drag`] = interactionColors.drag;
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
            ...(surfacePrefix === "bg"
              ? {}
              : {
                  [`@apply bg-${colorName}`]: {},
                }),
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
                  [`@apply disabled:text-${disabledStyles.colorName}/[${disabledStyles.textOpacity}]`]:
                    {},
                  [`@apply disabled:bg-${disabledStyles.colorName}/[${disabledStyles.backgroundOpacity}]`]:
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

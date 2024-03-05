const colorMix = require("tailwindcss-color-mix");
const plugin = require("tailwindcss/plugin");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const DEFAULT_OPTIONS = {
  hoverAmount: "8%",
  pressAmount: "12%",
  focusAmount: "12%",
  dragAmount: "16%",
  surfacePrefix: "surface",
  interactiveSurfacePrefix: "interactive-surface",
  draggedSurfacePrefix: "dragged-surface",
  disabledStyles: {
    textOpacity: 0.38,
    backgroundOpacity: 0.12,
    colorName: "black",
  },
  transition: {
    duration: 150,
  },
};

module.exports = (options = {}) => {
  const {
    surfacePrefix,
    interactiveSurfacePrefix,
    draggedSurfacePrefix,
    disabledStyles,
    transition,
    ...mixAmounts
  } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return [
    colorMix(),
    plugin(({ matchComponents, theme }) => {
      const colors = flattenColorPalette(theme("colors"));

      const materialColors = Object.keys(colors).filter(
        (colorName) => colors[`on-${colorName}`]
      );

      const materialColorsObject = Object.fromEntries(
        materialColors.map((colorName) => [colorName, colorName])
      );

      matchComponents(
        {
          [surfacePrefix]: (colorName) => ({
            ...(surfacePrefix === "bg"
              ? {}
              : {
                  [`@apply bg-${colorName}`]: {},
                }),
            [`@apply text-on-${colorName}`]: {},
          }),
          [interactiveSurfacePrefix]: (colorName) => ({
            [`@apply bg-${colorName}`]: {},
            [`@apply text-on-${colorName}`]: {},
            [`@apply bg-mix-on-${colorName}`]: {},
            ...(transition
              ? {
                  [`@apply transition-colors`]: {},
                  [`@apply duration-${transition.duration}`]: {},
                }
              : {}),
            [`@apply hover:bg-mix-amount-[${mixAmounts.hoverAmount}]`]: {},
            [`@apply active:bg-mix-amount-[${mixAmounts.pressAmount}]`]: {},
            [`@apply focus-visible:bg-mix-amount-[${mixAmounts.focusAmount}]`]:
              {},
            ...(disabledStyles
              ? {
                  [`@apply disabled:text-${disabledStyles.colorName}/[${disabledStyles.textOpacity}]`]:
                    {},
                  [`@apply disabled:bg-${disabledStyles.colorName}/[${disabledStyles.backgroundOpacity}]`]:
                    {},
                }
              : {}),
          }),
          [draggedSurfacePrefix]: (colorName) => ({
            [`@apply bg-${colorName}`]: {},
            [`@apply text-on-${colorName}`]: {},
            [`@apply bg-mix-on-${colorName}`]: {},
            [`@apply bg-mix-amount-[${mixAmounts.dragAmount}]`]: {},
            ...(transition
              ? {
                  [`@apply transition-colors`]: {},
                  [`@apply duration-${transition.duration}`]: {},
                }
              : {}),
          }),
        },
        {
          values: materialColorsObject,
        }
      );
      // TODO call within plugins
      // TODO readme
    }, {}),
  ];
};

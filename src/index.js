const plugin = require("tailwindcss/plugin");
const chroma = require("chroma-js");
const { over } = require("color-composite");

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

module.exports = (config) => {
  const colors = flattenColorPalette(config.theme.colors || {});

  Object.keys(colors).forEach((colorName) => {
    const onColorName = `on-${colorName}`;
    const color = colors[colorName];
    const onColor = colors[onColorName];

    if (
      !colorName.startsWith("on-") &&
      chroma.valid(color) &&
      chroma.valid(onColor)
    ) {
      const hoverColor = mix(onColor, color, 0.08);
      const pressColor = mix(onColor, color, 0.12);
      const dragColor = mix(onColor, color, 0.16);

      colors[`${colorName}-hover`] = hoverColor;
      colors[`${colorName}-focus`] = pressColor;
      colors[`${colorName}-press`] = pressColor;
      colors[`${colorName}-drag`] = dragColor;
    }
  });

  return {
    ...config,
    theme: { ...(config.theme || []), colors },
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
          newComponents[`.surface-${colorName}`] = {
            [`@apply bg-${colorName}`]: {},
            [`@apply text-on-${colorName}`]: {},
          };

          newComponents[`.interactive-surface-${colorName}`] = {
            [`@apply bg-${colorName}`]: {},
            [`@apply text-on-${colorName}`]: {},
            [`@apply hover:bg-${colorName}-hover`]: {},
            [`@apply active:bg-${colorName}-press`]: {},
            [`@apply focus-visible:bg-${colorName}-focus`]: {},
            [`@apply transition-colors`]: {},
            [`@apply disabled:text-on-${colorName}/[0.38]`]: {},
            [`@apply disabled:bg-on-${colorName}/[0.12]`]: {},
          };
        });

        addComponents(newComponents);
      }, {}),
    ],
  };
};

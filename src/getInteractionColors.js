const chroma = require("chroma-js");
const { over } = require("color-composite");

const mix = (foregroundColor, backgroundColor, overlayOpacity) => {
  // TODO check if transparent makes sense
  const {
    values: [r, g, b],
  } = over(
    chroma(foregroundColor).alpha(overlayOpacity).hex(),
    backgroundColor
  );
  return `rgb(${r}, ${g}, ${b})`;
};

module.exports = (color, onColor, config) => ({
  hover: mix(onColor, color, config?.hoverOpacity || 0.08),
  press: mix(onColor, color, config?.pressOpacity || 0.12),
  focus: mix(onColor, color, config?.focusOpacity || 0.12),
  drag: mix(onColor, color, config?.dragOpacity || 0.16),
});

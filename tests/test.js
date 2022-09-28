const withMaterialSurfaces = require("../src/index");
const postcss = require("postcss");

describe("And there are colors with a defined 'on' color", () => {
  it("Flattens color map and adds -hover, -focus, -press and -drag versions for those colors", () => {
    expect(
      withMaterialSurfaces({
        theme: {
          colors: {
            a: "#ff0000",
            on: {
              a: "#0000ff",
            },
          },
        },
      })
    ).toEqual(
      expect.objectContaining({
        theme: {
          colors: {
            a: "#ff0000",
            "on-a": "#0000ff",
            "a-hover": "rgb(235, 0, 20)", // 8% blue over red
            "a-focus": "rgb(224, 0, 31)", // 12% blue over red
            "a-press": "rgb(224, 0, 31)", // 12% blue over red
            "a-drag": "rgb(214, 0, 41)", // 16% blue over red
          },
        },
      })
    );
  });

  it("Flattens extend color map and adds -hover, -focus, -press and -drag versions for those colors", () => {
    expect(
      withMaterialSurfaces({
        theme: {
          extend: {
            colors: {
              a: "#ff0000",
              on: {
                a: "#0000ff",
              },
            },
          },
        },
      })
    ).toEqual(
      expect.objectContaining({
        theme: {
          extend: {
            colors: {
              a: "#ff0000",
              "on-a": "#0000ff",
              "a-hover": "rgb(235, 0, 20)", // 8% blue over red
              "a-focus": "rgb(224, 0, 31)", // 12% blue over red
              "a-press": "rgb(224, 0, 31)", // 12% blue over red
              "a-drag": "rgb(214, 0, 41)", // 16% blue over red
            },
          },
        },
      })
    );
  });

  it("Mixes colors correctly for the supported color syntaxes", () => {
    expect(
      withMaterialSurfaces({
        theme: {
          colors: {
            keyword: "red",
            "short-hex": "#f00",
            hex: "#ff0000",
            on: {
              keyword: "blue",
              "short-hex": "#00f",
              hex: "#0000ff",
            },
          },
        },
      })
    ).toEqual(
      expect.objectContaining({
        theme: {
          colors: expect.objectContaining({
            "keyword-hover": "rgb(235, 0, 20)",
            "short-hex-hover": "rgb(235, 0, 20)",
            "hex-hover": "rgb(235, 0, 20)",
          }),
        },
      })
    );
  });
});

it("Generates the correct CSS", () => {
  const config = withMaterialSurfaces({
    content: [
      {
        raw: "bg-a-hover/50 text-a-press border-a-focus shadow-a-drag surface-a interactive-surface-a",
      },
    ],
    theme: {
      colors: {
        a: "#ff0000",
        on: {
          a: "#0000ff",
        },
      },
    },
  });

  let utilitiesCSS = postcss([require("tailwindcss")(config)]).process(
    "@tailwind utilities"
  ).css;

  expect(utilitiesCSS.replace(/\n|\s|\t/g, "")).toBe(
    `
      .border-a-focus {
        --tw-border-opacity:1;
        border-color: rgb(224 0 31 / var(--tw-border-opacity))
      }
      .bg-a-hover\\/50 {
        background-color: rgb(235 0 20 / 0.5)
      }
      .text-a-press {
        --tw-text-opacity:1;
        color: rgb(224 0 31 / var(--tw-text-opacity))
      }
      .shadow-a-drag {
        --tw-shadow-color: rgb(214, 0, 41);
        --tw-shadow: var(--tw-shadow-colored)
      }
    `.replace(/\n|\s|\t/g, "")
  );

  let componentsCSS = postcss([require("tailwindcss")(config)]).process(
    "@tailwind components"
  ).css;

  expect(componentsCSS.replace(/\n|\s|\t/g, "")).toBe(
    `
      .surface-a {
        --tw-bg-opacity:1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity))
      }
      .interactive-surface-a {
        --tw-bg-opacity:1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity))
      }
      .interactive-surface-a:hover {
        --tw-bg-opacity:1;
        background-color: rgb(235 0 20 / var(--tw-bg-opacity))
      }
      .interactive-surface-a:active {
        --tw-bg-opacity:1;
        background-color: rgb(224 0 31 / var(--tw-bg-opacity))
      }
      .interactive-surface-a:focus-visible {
        --tw-bg-opacity:1;
        background-color: rgb(224 0 31 / var(--tw-bg-opacity))
      }
      .interactive-surface-a {
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms
      }
      .interactive-surface-a:disabled {
        color: rgb(0 0 255 / 0.38);
        background-color: rgb(0 0 255 / 0.12)
      }
    `.replace(/\n|\s|\t/g, "")
  );
});

describe("When specifying user options", () => {
  it("Generates the correct CSS", () => {
    const config = withMaterialSurfaces(
      {
        content: [
          {
            raw: "bg-a-hover/50 text-a-press border-a-focus shadow-a-drag sf-a isf-a",
          },
        ],
        theme: {
          colors: {
            a: "#ff0000",
            on: {
              a: "#0000ff",
            },
          },
        },
      },
      {
        hoverOpacity: 0.16,
        pressOpacity: 0.08,
        focusOpacity: 0.08,
        dragOpacity: 0.12,
        surfacePrefix: "sf",
        interactiveSurfacePrefix: "isf",
        disabledStyles: {
          textOpacity: 0.2,
          backgroundOpacity: 0.05,
        },
        transition: {
          duration: 1000,
        },
      }
    );

    let utilitiesCSS = postcss([require("tailwindcss")(config)]).process(
      "@tailwind utilities"
    ).css;

    expect(utilitiesCSS.replace(/\n|\s|\t/g, "")).toBe(
      `
      .border-a-focus {
        --tw-border-opacity:1;
        border-color: rgb(235 0 20 / var(--tw-border-opacity))
      }
      .bg-a-hover\\/50 {
        background-color: rgb(214 0 41 / 0.5)
      }
      .text-a-press {
        --tw-text-opacity:1;
        color: rgb(235 0 20 / var(--tw-text-opacity))
      }
      .shadow-a-drag {
        --tw-shadow-color: rgb(224, 0, 31);
        --tw-shadow: var(--tw-shadow-colored)
      }
    `.replace(/\n|\s|\t/g, "")
    );

    let componentsCSS = postcss([require("tailwindcss")(config)]).process(
      "@tailwind components"
    ).css;

    expect(componentsCSS.replace(/\n|\s|\t/g, "")).toBe(
      `
      .sf-a {
        --tw-bg-opacity:1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity))
      }
      .isf-a {
        --tw-bg-opacity:1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity))
      }
      .isf-a:hover {
        --tw-bg-opacity:1;
        background-color: rgb(214 0 41 / var(--tw-bg-opacity))
      }
      .isf-a:active {
        --tw-bg-opacity:1;
        background-color: rgb(235 0 20 / var(--tw-bg-opacity))
      }
      .isf-a:focus-visible {
        --tw-bg-opacity:1;
        background-color: rgb(235 0 20 / var(--tw-bg-opacity))
      }
      .isf-a {
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 1000ms
      }
      .isf-a:disabled {
        color: rgb(0 0 255 / 0.2);
        background-color: rgb(0 0 255 / 0.05)
      }
    `.replace(/\n|\s|\t/g, "")
    );
  });
});

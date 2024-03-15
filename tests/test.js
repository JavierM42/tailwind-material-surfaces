const tailwindMaterialSurfaces = require("../src/index");
const postcss = require("postcss");

describe("When there are colors with a defined 'on' color", () => {
  it("Generates the correct CSS", () => {
    const config = {
      content: [
        {
          raw: "surface-a interactive-surface-a dragged-surface-a",
        },
      ],
      theme: {
        colors: {
          black: "#000000",
          a: "#ff0000",
          on: {
            a: "#0000ff",
          },
        },
      },
      plugins: [...tailwindMaterialSurfaces()],
    };

    let componentsCSS = postcss([require("tailwindcss")(config)]).process(
      "@tailwind components"
    ).css;

    expect(componentsCSS.replace(/\n|\s|\t/g, "")).toBe(
      `
      .surface-a {
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-bg-opacity:1;
        --tw-bg-base: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity))
      }
      .interactive-surface-a {
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-bg-opacity:1;
        --tw-bg-base: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity));
        --tw-bg-mix-opacity: 1;
        background-color: color-mix(
          var(--tw-bg-mix-method, in srgb),
          rgb(0 0 255 / var(--tw-bg-mix-opacity)) calc(var(--tw-bg-mix-amount, 0) * 1%),
          var(--tw-bg-base)
        );
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms
      }
      .interactive-surface-a:hover {
        --tw-bg-mix-amount: 8
      }
      .interactive-surface-a:active {
        --tw-bg-mix-amount: 12
      }
      .interactive-surface-a:focus-visible {
        --tw-bg-mix-amount: 12
      }
      .interactive-surface-a:disabled {
        color: rgb(0 0 0 / 0.38);
        background-color: rgb(0 0 0 / 0.12);
        --tw-bg-base: rgb(0 0 0 / 0.12)
      }
      .dragged-surface-a {
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-bg-opacity:1;
        --tw-bg-base: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity));
        --tw-bg-mix-opacity: 1;
        background-color: color-mix(
          var(--tw-bg-mix-method, in srgb),
          rgb(0 0 255 / var(--tw-bg-mix-opacity)) calc(var(--tw-bg-mix-amount, 0) * 1%),
          var(--tw-bg-base)
        );
        --tw-bg-mix-amount: 16;
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms
      }
    `.replace(/\n|\s|\t/g, "")
    );
  });

  describe("When specifying user options", () => {
    it("Generates the correct CSS", () => {
      const config = {
        content: [
          {
            raw: "bg-a ibg-a dbg-a",
          },
        ],
        theme: {
          colors: {
            black: "#000000",
            a: "#ff0000",
            on: {
              a: "#0000ff",
            },
          },
        },
        plugins: [
          ...tailwindMaterialSurfaces({
            hoverAmount: "9",
            pressAmount: "13",
            focusAmount: "13",
            dragAmount: "17",
            surfacePrefix: "bg", // bg is special because it won't re-apply bg utility
            interactiveSurfacePrefix: "ibg",
            draggedSurfacePrefix: "dbg",
            disabledStyles: {
              textOpacity: 0.2,
              backgroundOpacity: 0.05,
              colorName: "black",
            },
            transition: {
              duration: 1000,
            },
          }),
        ],
      };

      let componentsCSS = postcss([require("tailwindcss")(config)]).process(
        "@tailwind components"
      ).css;

      expect(componentsCSS.replace(/\n|\s|\t/g, "")).toBe(
        `
      .bg-a {
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity))
      }
      .ibg-a {
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-bg-opacity:1;
        --tw-bg-base: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity));
        --tw-bg-mix-opacity: 1;
        background-color: color-mix(
          var(--tw-bg-mix-method, in srgb),
          rgb(0 0 255 / var(--tw-bg-mix-opacity)) calc(var(--tw-bg-mix-amount, 0) * 1%),
          var(--tw-bg-base)
        );
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 1000ms
      }
      .ibg-a:hover {
        --tw-bg-mix-amount: 9
      }
      .ibg-a:active {
        --tw-bg-mix-amount: 13
      }
      .ibg-a:focus-visible {
        --tw-bg-mix-amount: 13
      }
      .ibg-a:disabled {
        color: rgb(0 0 0 / 0.2);
        background-color: rgb(0 0 0 / 0.05);
        --tw-bg-base: rgb(0 0 0 / 0.05)
      }
      .dbg-a {
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-bg-opacity:1;
        --tw-bg-base: rgb(255 0 0 / var(--tw-bg-opacity));
        --tw-text-opacity:1;
        color: rgb(0 0 255 / var(--tw-text-opacity));
        --tw-bg-mix-opacity: 1;
        background-color: color-mix(
          var(--tw-bg-mix-method, in srgb),
          rgb(0 0 255 / var(--tw-bg-mix-opacity)) calc(var(--tw-bg-mix-amount, 0) * 1%),
          var(--tw-bg-base)
        );
        --tw-bg-mix-amount: 17;
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 1000ms
      }
    `.replace(/\n|\s|\t/g, "")
      );
    });
  });
});

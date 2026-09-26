import type { Preview } from "@storybook/react-vite";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-mono/400.css";
import "../packages/tokens/dist/tokens.css";
import "../packages/react/src/styles.css";
import "./preview.css";

// Theme, density and direction are switched on the root element, as an
// application would do it.
const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Colour theme",
      toolbar: { title: "Theme", items: ["light", "dark"], dynamicTitle: true },
    },
    density: {
      description: "Density",
      toolbar: { title: "Density", items: ["compact", "regular", "comfortable"], dynamicTitle: true },
    },
    dir: {
      description: "Direction",
      toolbar: { title: "Direction", items: ["ltr", "rtl"], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "light", density: "regular", dir: "ltr" },
  decorators: [
    (Story, ctx) => {
      const root = document.documentElement;
      root.dataset.theme = ctx.globals.theme;
      root.dataset.density = ctx.globals.density;
      root.dir = ctx.globals.dir;
      return <Story />;
    },
  ],
  parameters: { layout: "padded" },
};
export default preview;

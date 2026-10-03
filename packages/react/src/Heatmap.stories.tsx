import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heatmap } from "./Heatmap";
import { sampleHeatmap } from "./fixtures";

const meta: Meta<typeof Heatmap> = {
  title: "Data/Heatmap",
  component: Heatmap,
  args: {
    label: "Displayed liquidity over the last 10 minutes",
    description: "Bids below the midpoint, asks above; darker cells hold more shares.",
    height: 320,
  },
};
export default meta;

export const Liquidity: StoryObj<typeof Heatmap> = { args: { data: sampleHeatmap() } };
export const Sparse: StoryObj<typeof Heatmap> = { args: { data: sampleHeatmap(60, 40, 11) } };

/** Nothing to draw yet: the chart says so, on the canvas and as text. */
export const Empty: StoryObj<typeof Heatmap> = { args: { data: null } };

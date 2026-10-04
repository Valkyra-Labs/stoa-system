import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Controls";

const meta: Meta = { title: "Controls/Inputs" };
export default meta;

const row = { display: "flex", gap: "var(--stoa-space-3)", alignItems: "center", flexWrap: "wrap" } as const;

/** The five variants at rest. Hover, press and keyboard focus are drawn by
 * each variant's own rules; Tab to a button to see its ring. Danger says
 * what it destroys in its label, so the colour is not the only sign. */
export const ButtonVariants: StoryObj = {
  render: () => (
    <div style={row}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete 3 orders</Button>
    </div>
  ),
};

/** Disabled reads the same in every variant: no fill, subtle text. */
export const ButtonsDisabled: StoryObj = {
  render: () => (
    <div style={row}>
      <Button isDisabled>Default</Button>
      <Button variant="primary" isDisabled>
        Primary
      </Button>
      <Button variant="secondary" isDisabled>
        Secondary
      </Button>
      <Button variant="ghost" isDisabled>
        Ghost
      </Button>
      <Button variant="danger" isDisabled>
        Delete 3 orders
      </Button>
    </div>
  ),
};

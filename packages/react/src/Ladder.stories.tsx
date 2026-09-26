import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef } from "react";
import { Ladder, type LadderHandle } from "./Ladder";
import { sampleBook } from "./fixtures";

const meta: Meta<typeof Ladder> = {
  title: "Data/Ladder",
  component: Ladder,
  args: { label: "Order book, 12 levels per side", depth: 12 },
  decorators: [(Story) => <div style={{ maxInlineSize: 360 }}><Story /></div>],
};
export default meta;

export const Static: StoryObj<typeof Ladder> = { args: { data: sampleBook() } };

/** Updated through the imperative handle at the display's frame rate,
 * without a React render per frame, as a replay does. */
export const Live: StoryObj<typeof Ladder> = {
  render: (args) => {
    const ref = useRef<LadderHandle>(null);
    useEffect(() => {
      let raf = 0;
      let seed = 1;
      let mid = 222.6;
      const tick = () => {
        mid = +(mid + (Math.random() - 0.5) * 0.02).toFixed(2);
        ref.current?.draw(sampleBook(mid, args.depth, seed++));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [args.depth]);
    return <Ladder {...args} ref={ref} />;
  },
};

export const Empty: StoryObj<typeof Ladder> = { args: { data: null } };

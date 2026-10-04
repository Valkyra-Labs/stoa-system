import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { ChoiceGroup } from "./Controls";
import { Disclosure } from "./Disclosure";
import { StatusBadge } from "./Form";
import { Panel, StatBar } from "./Panel";

const meta: Meta = { title: "Layout/Panel" };
export default meta;

/** A titled region; its heading names it for assistive technology. */
export const Titled: StoryObj = {
  render: () => (
    <Panel title="Session">
      <StatBar
        label="Session counters"
        items={[
          { label: "frames/s", value: "60" },
          { label: "frame p95", value: "16.9 ms" },
          { label: "book p95", value: "0.50 ms" },
        ]}
      />
    </Panel>
  ),
};

/** Sections that open and close, with the Select's chevron. */
export const Sections: StoryObj = {
  render: () => (
    <Panel title="Checks">
      <Disclosure summary="Text contrast (44)" defaultOpen>
        <StatusBadge tone="positive">44 passed</StatusBadge>
      </Disclosure>
      <Disclosure summary="Target size (3)">
        <StatusBadge tone="positive">3 passed</StatusBadge>
      </Disclosure>
    </Panel>
  ),
};

/** The bar at the top of an application: name, subtitle, a note and the
 * theme and language switches. */
export const Header: StoryObj = {
  render: () => {
    const [theme, setTheme] = useState("light");
    const [lang, setLang] = useState("en");
    return (
      <AppHeader
        title="Tyche Replay"
        subtitle="AAPL on IEX"
        note="Data provided for free by IEX."
        actions={
          <>
            <ChoiceGroup
              label="Theme"
              size="small"
              value={theme}
              onChange={setTheme}
              choices={[
                { id: "light", label: "Light" },
                { id: "dark", label: "Dark" },
              ]}
            />
            <ChoiceGroup
              label="Language"
              size="small"
              value={lang}
              onChange={setLang}
              choices={[
                { id: "en", label: "EN" },
                { id: "ar", label: "AR" },
              ]}
            />
          </>
        }
      />
    );
  },
  parameters: { layout: "fullscreen" },
};

import type { ReactNode } from "react";
import {
  Input,
  Label,
  Tab as AriaTab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
  Text,
  TextField as AriaTextField,
  type Key,
} from "react-aria-components";

export type TextFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  description?: string;
  placeholder?: string;
  /** Direction of the typed text; maths stays left to right in an RTL page. */
  dir?: "ltr" | "rtl" | "auto";
  autoFocus?: boolean;
};

/** A labelled text input. Enter can submit without a surrounding form. */
export function TextField({ label, value, onChange, onEnter, description, placeholder, dir, autoFocus }: TextFieldProps) {
  return (
    <AriaTextField className="stoa-field" value={value} onChange={onChange} autoFocus={autoFocus}>
      <Label className="stoa-field__label">{label}</Label>
      <Input
        className="stoa-field__input"
        placeholder={placeholder}
        dir={dir}
        spellCheck={false}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            e.preventDefault();
            onEnter();
          }
        }}
      />
      {description && (
        <Text slot="description" className="stoa-field__description">
          {description}
        </Text>
      )}
    </AriaTextField>
  );
}

export type StatusTone = "positive" | "negative" | "warning" | "neutral";

/** A short status with a symbol and a word, never colour alone. */
export function StatusBadge({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  const symbol = { positive: "✓", negative: "✗", warning: "!", neutral: "·" }[tone];
  return (
    <span className={`stoa-badge stoa-badge--${tone}`}>
      <span aria-hidden="true">{symbol}</span> {children}
    </span>
  );
}

export type TabItem = { id: string; label: string; content: ReactNode };

/** Tabs with arrow-key navigation (React Aria). */
export function Tabs({ label, items, selected, onChange }: { label: string; items: TabItem[]; selected?: string; onChange?: (id: string) => void }) {
  return (
    <AriaTabs className="stoa-tabs" selectedKey={selected} onSelectionChange={(k: Key) => onChange?.(String(k))}>
      <TabList aria-label={label} className="stoa-tabs__list">
        {items.map((t) => (
          <AriaTab key={t.id} id={t.id} className="stoa-tabs__tab">
            {t.label}
          </AriaTab>
        ))}
      </TabList>
      {items.map((t) => (
        <TabPanel key={t.id} id={t.id} className="stoa-tabs__panel">
          {t.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}

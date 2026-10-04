import { useContext, useEffect, useLayoutEffect, useMemo, useRef, type ChangeEvent, type ReactNode } from "react";
import { Chevron } from "./Chevron";
import {
  Button as AriaButton,
  Group,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  NumberField as AriaNumberField,
  NumberFieldStateContext,
  Popover,
  Select as AriaSelect,
  SelectValue,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  ToggleButton,
  ToggleButtonGroup,
  type ButtonProps as AriaButtonProps,
  type Key,
  useLocale,
} from "react-aria-components";

/** `default` is a bordered button; `primary` the one main action of a view,
 * on the accent fill; `secondary` a quieter action on the sunken surface,
 * without a border; `ghost` an action with no fill or border until hovered
 * (in a toolbar, for example); `danger` an action that destroys or cannot
 * be undone, on the falling colour. Say what the danger is in the label
 * ("Delete 3 orders"): the colour is not the only sign. */
export type ButtonProps = AriaButtonProps & { variant?: "default" | "primary" | "secondary" | "ghost" | "danger" };

export function Button({ variant = "default", className, ...rest }: ButtonProps) {
  return <AriaButton {...rest} className={`stoa-button stoa-button--${variant} ${className ?? ""}`.trim()} />;
}

export type Choice<T extends Key> = { id: T; label: ReactNode };

/** "small" is for toolbars and headers: smaller type and padding, still
 * at least 24 px tall (WCAG 2.5.8). */
export type ControlSize = "regular" | "small";

export type ChoiceGroupProps<T extends Key> = {
  label: string;
  choices: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: ControlSize;
};

/** One of a few options (for example a playback speed): a toggle group
 * with single selection, arrow keys moving between options. */
export function ChoiceGroup<T extends Key>({ label, choices, value, onChange, size = "regular" }: ChoiceGroupProps<T>) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const [first] = keys;
        if (first !== undefined) onChange(first as T);
      }}
      className={`stoa-choice-group stoa-choice-group--${size}`}
    >
      {choices.map((c) => (
        <ToggleButton key={String(c.id)} id={c.id} className="stoa-button stoa-choice">
          {c.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export type SelectProps<T extends Key> = {
  label: string;
  /** Keep the label for assistive technology only, where the options
   * name themselves (a view picker in a header, for example). */
  hideLabel?: boolean;
  options: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: ControlSize;
};

/** One of several options in a drop-down list: for a choice with more
 * options, or less room, than a ChoiceGroup can show. Enter, Space or an
 * arrow key opens the list; typing a name selects the option it starts. */
export function Select<T extends Key>({ label, hideLabel = false, options, value, onChange, size = "regular" }: SelectProps<T>) {
  return (
    <AriaSelect
      className={`stoa-select stoa-select--${size}`}
      selectedKey={value}
      onSelectionChange={(key) => {
        if (key !== null) onChange(key as T);
      }}
    >
      <Label className={hideLabel ? "stoa-visually-hidden" : "stoa-field__label"}>{label}</Label>
      <AriaButton className="stoa-button stoa-select__button">
        <SelectValue className="stoa-select__value" />
        <Chevron className="stoa-select__chevron" />
      </AriaButton>
      <Popover className={`stoa-select__popover stoa-select__popover--${size}`} offset={4}>
        <ListBox className="stoa-select__list">
          {options.map((option) => (
            <ListBoxItem
              key={String(option.id)}
              id={option.id}
              className="stoa-select__option"
              textValue={typeof option.label === "string" ? option.label : String(option.id)}
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export type ToggleProps = {
  /** The name of the setting the toggle turns on ("Reduced motion"). */
  children: ReactNode;
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
  size?: ControlSize;
};

/** One setting turned on or off: a button that stays pressed while the
 * setting is on (aria-pressed), drawn like a chosen option when it is. */
export function Toggle({ children, isSelected, onChange, size = "regular" }: ToggleProps) {
  return (
    <ToggleButton
      isSelected={isSelected}
      onChange={onChange}
      className={`stoa-button stoa-choice stoa-toggle stoa-toggle--${size}`}
    >
      {children}
    </ToggleButton>
  );
}

export type TimeSliderProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  /** The value stopped moving: the drag was released or the key let go.
   * A caller that records history uses this to end one step. */
  onChangeEnd?: (value: number) => void;
  /** Text for the current value, shown and announced. */
  format: (value: number) => string;
  /** Ids of elements that describe the slider, announced with its value. */
  "aria-describedby"?: string;
  /** Show the formatted value beside the track. Off when a field next to
   * the slider already shows (and edits) the value; the value is still
   * announced. */
  showOutput?: boolean;
};

/** A time scrubber: keyboard steps, and the value read out as text.
 *
 * React Aria formats slider values only with Intl.NumberFormat; a time of
 * day needs its own text, so the thumb's input gets `aria-valuetext`
 * after each render. */
export function TimeSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  onChangeEnd,
  format,
  "aria-describedby": describedBy,
  showOutput = true,
}: TimeSliderProps) {
  const input = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    input.current?.setAttribute("aria-valuetext", format(value));
  });
  return (
    <Slider
      className={showOutput ? "stoa-slider" : "stoa-slider stoa-slider--bare"}
      minValue={min}
      maxValue={max}
      step={step}
      value={value}
      onChange={(v) => onChange(v as number)}
      onChangeEnd={onChangeEnd && ((v) => onChangeEnd(v as number))}
      aria-describedby={describedBy}
    >
      <Label className="stoa-visually-hidden">{label}</Label>
      {showOutput && (
        <SliderOutput className="stoa-slider__output">{({ state }) => format(state.getThumbValue(0))}</SliderOutput>
      )}
      <SliderTrack className="stoa-slider__track">
        <SliderThumb className="stoa-slider__thumb" inputRef={input} />
      </SliderTrack>
    </Slider>
  );
}

export type NumberFieldProps = {
  label: string;
  /** Keep the label for assistive technology only, where the field sits
   * beside a visible name (a slider's heading, for example). */
  hideLabel?: boolean;
  value: number;
  /** Called with a committed number: on Enter, on leaving the field, or on
   * each arrow-key step. An emptied field reports nothing. */
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  /** The arrow keys' stride. A typed value is also rounded to the nearest
   * step (counted from `minValue`, or from 0) when it is committed, as
   * React Aria's NumberField does: with a step of 10000, a typed 500
   * becomes 0. Set `keepTypedValue` to keep what was typed. */
  step?: number;
  /** Keep a typed value as typed instead of rounding it to the step; it is
   * still clamped to `minValue` and `maxValue`, and the arrow keys still
   * move by `step`. For an amount that is usually changed in round steps
   * but may be any number. Off by default. */
  keepTypedValue?: boolean;
  /** A unit drawn after the number ("px"). Include it in `label` too: the
   * drawn unit is hidden from assistive technology. */
  unit?: string;
  size?: ControlSize;
  "aria-describedby"?: string;
};

const LATIN_DIGIT = /[0-9.]/;

/** For a locale tag that fixes its numbering system ("ar-u-nu-arab"), a
 * function that rewrites typed Latin digits, and "." as the decimal
 * separator, in the locale's own; null when the locale writes Latin
 * digits. React Aria's number parser tries other numbering systems only
 * when the tag does not fix one, so without this a person on a Latin
 * keyboard layout could not type a number at all. */
function typedDigits(locale: string): ((text: string) => string) | null {
  if (!locale.includes("-nu-")) return null;
  const plain = new Intl.NumberFormat(locale, { useGrouping: false });
  const map = new Map<string, string>(Array.from({ length: 10 }, (_, d) => [String(d), plain.format(d)]));
  if (map.get("0") === "0") return null;
  const point = new Intl.NumberFormat(locale, { minimumFractionDigits: 1 }).formatToParts(1.5).find((part) => part.type === "decimal")?.value;
  if (point) map.set(".", point);
  return (text) => (LATIN_DIGIT.test(text) ? text.replace(/[0-9.]/g, (character) => map.get(character) ?? character) : text);
}

/** The field's input. Under a locale with its own digits, digits typed in
 * Latin are written in the locale's as they are typed: in the browser
 * before the input changes (React Aria refuses the Latin text in its own
 * beforeinput listener, which this one runs ahead of), and on a change
 * that arrives without a beforeinput event (a test, an autofill). */
function NumberInput({ unit }: { unit?: string }) {
  const { locale } = useLocale();
  const state = useContext(NumberFieldStateContext);
  const toLocal = useMemo(() => typedDigits(locale), [locale]);
  const group = useRef<HTMLDivElement>(null);
  const latest = useRef({ state, toLocal });
  useLayoutEffect(() => {
    latest.current = { state, toLocal };
  });

  useEffect(() => {
    const box = group.current;
    if (!box || !toLocal) return;
    // Capture, on the group: it runs before React Aria's listener on the
    // input itself.
    const onBeforeInput = (event: Event) => {
      const e = event as InputEvent;
      const input = e.target;
      if (!(input instanceof HTMLInputElement) || e.data == null || !e.inputType.startsWith("insert")) return;
      const local = latest.current.toLocal?.(e.data) ?? e.data;
      if (local === e.data) return;
      e.preventDefault();
      // insertText keeps the browser's undo history and caret; it fires a
      // beforeinput of its own, with the locale's digits, which passes.
      if (input.ownerDocument.execCommand("insertText", false, local)) return;
      const { selectionStart: from, selectionEnd: to, value } = input;
      const next = value.slice(0, from ?? value.length) + local + value.slice(to ?? value.length);
      if (latest.current.state?.validate(next)) latest.current.state.setInputValue(next);
    };
    box.addEventListener("beforeinput", onBeforeInput, true);
    return () => box.removeEventListener("beforeinput", onBeforeInput, true);
  }, [toLocal]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const local = toLocal?.(raw) ?? raw;
    if (local !== raw && state && !state.validate(raw) && state.validate(local)) state.setInputValue(local);
  };

  return (
    <Group ref={group} className="stoa-number__group">
      <Input className="stoa-field__input stoa-number__input" onChange={onChange} />
      {unit && (
        <span className="stoa-number__unit" aria-hidden="true">
          {unit}
        </span>
      )}
    </Group>
  );
}

/** A number typed by hand, on React Aria: the arrow keys step it, and it
 * is formatted in the locale. Under a locale with its own digits
 * (Arabic-Indic in "ar-u-nu-arab"), digits typed on a Latin keyboard
 * layout are taken and shown in the locale's digits. */
export function NumberField({
  label,
  hideLabel = false,
  value,
  onChange,
  minValue,
  maxValue,
  step,
  keepTypedValue = false,
  unit,
  size = "regular",
  "aria-describedby": describedBy,
}: NumberFieldProps) {
  const clamp = (next: number) => Math.min(maxValue ?? Infinity, Math.max(minValue ?? -Infinity, next));
  return (
    <AriaNumberField
      className={`stoa-number stoa-number--${size}`}
      value={value}
      onChange={(next) => {
        if (Number.isFinite(next)) onChange(keepTypedValue ? clamp(next) : next);
      }}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      aria-describedby={describedBy}
      // React Aria's "validate" keeps the typed value and would report a
      // value off the step as invalid; here the step is only the arrow
      // keys' stride, and the range is applied by clamping above.
      {...(keepTypedValue ? { commitBehavior: "validate", validationBehavior: "aria", isInvalid: false } : {})}
    >
      <Label className={hideLabel ? "stoa-visually-hidden" : "stoa-field__label"}>{label}</Label>
      <NumberInput unit={unit} />
    </AriaNumberField>
  );
}

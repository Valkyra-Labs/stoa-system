import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Chevron } from "./Chevron";
import {
  Button as AriaButton,
  Group,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  NumberField as AriaNumberField,
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
} from "react-aria-components";

export type ButtonProps = AriaButtonProps & { variant?: "default" | "primary" };

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
  step?: number;
  /** A unit drawn after the number ("px"). Include it in `label` too: the
   * drawn unit is hidden from assistive technology. */
  unit?: string;
  size?: ControlSize;
  "aria-describedby"?: string;
};

/** A number typed by hand, on React Aria: the arrow keys step it, and it
 * is formatted in the locale. */
export function NumberField({
  label,
  hideLabel = false,
  value,
  onChange,
  minValue,
  maxValue,
  step,
  unit,
  size = "regular",
  "aria-describedby": describedBy,
}: NumberFieldProps) {
  return (
    <AriaNumberField
      className={`stoa-number stoa-number--${size}`}
      value={value}
      onChange={(next) => {
        if (Number.isFinite(next)) onChange(next);
      }}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      aria-describedby={describedBy}
    >
      <Label className={hideLabel ? "stoa-visually-hidden" : "stoa-field__label"}>{label}</Label>
      <Group className="stoa-number__group">
        <Input className="stoa-field__input stoa-number__input" />
        {unit && (
          <span className="stoa-number__unit" aria-hidden="true">
            {unit}
          </span>
        )}
      </Group>
    </AriaNumberField>
  );
}

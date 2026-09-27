import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  Button as AriaButton,
  Label,
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

export type ChoiceGroupProps<T extends Key> = {
  label: string;
  choices: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** One of a few options (for example a playback speed): a toggle group
 * with single selection, arrow keys moving between options. */
export function ChoiceGroup<T extends Key>({ label, choices, value, onChange }: ChoiceGroupProps<T>) {
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
      className="stoa-choice-group"
    >
      {choices.map((c) => (
        <ToggleButton key={String(c.id)} id={c.id} className="stoa-button stoa-choice">
          {c.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
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
}: TimeSliderProps) {
  const input = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    input.current?.setAttribute("aria-valuetext", format(value));
  });
  return (
    <Slider
      className="stoa-slider"
      minValue={min}
      maxValue={max}
      step={step}
      value={value}
      onChange={(v) => onChange(v as number)}
      onChangeEnd={onChangeEnd && ((v) => onChangeEnd(v as number))}
      aria-describedby={describedBy}
    >
      <Label className="stoa-visually-hidden">{label}</Label>
      <SliderOutput className="stoa-slider__output">{({ state }) => format(state.getThumbValue(0))}</SliderOutput>
      <SliderTrack className="stoa-slider__track">
        <SliderThumb className="stoa-slider__thumb" inputRef={input} />
      </SliderTrack>
    </Slider>
  );
}

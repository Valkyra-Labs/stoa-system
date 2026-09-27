// What Stoa promises about colour and size, as data.
//
// Every entry names one measurement and the reason it exists, so the docs
// can claim exactly this list and nothing wider. A pair that no component
// uses yet says so in its reason rather than being left out: the token is
// a promise whether or not something has taken it up.
//
// `enforced` defaults to true. An entry marked `enforced: false` is
// measured and reported but its failure does not fail a test, either
// because WCAG does not require the ratio for that use or because the
// threshold is a project decision rather than a standard. Nothing in
// `docs` or a test may describe a reported-only entry as a WCAG failure.
//
// Colour names are semantic token names without the `color-` prefix. A
// `bgOver` names the opaque colour a translucent `bg` is composited over
// before the measurement, for the case of text drawn on top of a wash.

/** WCAG 2.2 contrast minimum for normal-size text (1.4.3, AA). */
export const TEXT_AA = 4.5;
/** WCAG 2.2 contrast minimum for normal-size text at AAA (1.4.6). The
 * pairs that ask for it are the ones the tests already asked it of. */
export const TEXT_AAA = 7;
/** WCAG 2.2 non-text contrast minimum (1.4.11). */
export const NON_TEXT = 3;
/** WCAG 2.2 target size (minimum) (2.5.8), in CSS pixels. */
export const TARGET_SIZE_PX = 24;
/** Smallest CIEDE2000 difference this project wants between the rising
 * and falling colours, under normal vision and under each simulated
 * dichromacy. Not a standard: a project decision, set well above the
 * roughly 2.3 unit difference usually cited as just noticeable, so the two
 * are told apart at a glance in a dense grid. Reported, not enforced,
 * until Stage 2 decides the colours. */
export const UP_DOWN_MIN_DELTA_E = 10;
/** Smallest WCAG 2 contrast ratio this project wants between the rising
 * and falling colours themselves, so that the two can be told apart
 * without hue: in greyscale, on a failing display, or by a monochromat.
 * Also a project decision rather than a WCAG requirement, and reported
 * rather than enforced; 3:1 is borrowed from 1.4.11 as a starting point. */
export const UP_DOWN_MIN_CONTRAST = NON_TEXT;

/** Text-role colours against the surfaces they sit on. */
export const TEXT_PAIRS = [
  { fg: "text", bg: "bg", min: TEXT_AAA, reason: "Body text on the page background; the preview stylesheet sets both on `body`." },
  { fg: "text", bg: "surface", min: TEXT_AAA, reason: "Body text inside a panel, a table cell or the ladder." },
  { fg: "text", bg: "surface-hover", min: TEXT_AA, reason: "Button label while the pointer is over the button." },
  { fg: "text", bg: "surface-sunken", min: TEXT_AA, reason: "Body text in a sunken well." },
  { fg: "surface", bg: "accent", min: TEXT_AA, reason: "Label of a primary button or a selected choice: the surface colour reversed out of the accent fill." },
  { fg: "text-muted", bg: "surface", min: TEXT_AA, reason: "Panel title, field label, table header and statbar term." },
  { fg: "text-muted", bg: "bg", min: TEXT_AA, reason: "The same muted labels when a table or statbar sits straight on the page background." },
  { fg: "text-muted", bg: "surface-sunken", min: TEXT_AA, reason: "Muted labels in a sunken well." },
  { fg: "text-subtle", bg: "surface", min: TEXT_AA, reason: "The third text role. No component uses it yet; checked so the name keeps its promise." },
  { fg: "text-subtle", bg: "bg", min: TEXT_AA, reason: "The same, on the page background." },
  { fg: "accent", bg: "surface", min: TEXT_AA, reason: "Accent used as text or an icon inside a panel." },
  { fg: "accent", bg: "bg", min: TEXT_AA, reason: "The same, on the page background." },
  { fg: "up", bg: "surface", min: TEXT_AA, reason: "A rising price or change, in a table cell or a badge." },
  { fg: "down", bg: "surface", min: TEXT_AA, reason: "A falling price or change, in a table cell or a badge." },
  { fg: "up", bg: "bg", min: TEXT_AA, reason: "The same badge in a toolbar on the page background." },
  { fg: "down", bg: "bg", min: TEXT_AA, reason: "The same badge in a toolbar on the page background." },
  { fg: "bid", bg: "surface", min: TEXT_AA, reason: "Bid prices and the B marker the ladder draws over its own surface fill." },
  { fg: "ask", bg: "surface", min: TEXT_AA, reason: "Ask prices and the A marker the ladder draws over its own surface fill." },
  { fg: "warning", bg: "surface", min: TEXT_AA, reason: "The warning glyph of a status badge; the badge draws it as a character, so it is text." },
  { fg: "warning", bg: "bg", min: TEXT_AA, reason: "The same glyph on the page background." },
  {
    fg: "text-muted",
    bg: "bid",
    min: TEXT_AA,
    reason: "Top and bottom price label of the heatmap, drawn in text-muted over whatever cell is behind it. A bid cell reaches full opacity at the largest size in view, so the opaque bid colour is the worst case and the one measured.",
  },
  {
    fg: "text-muted",
    bg: "ask",
    min: TEXT_AA,
    reason: "The same labels over an ask cell at full opacity.",
  },
  {
    fg: "text",
    bg: "up-wash",
    bgOver: "surface",
    min: TEXT_AA,
    reason: "Size at the right of a ladder row, drawn in text over the bid depth bar: the wash composited over the ladder surface at its own alpha.",
  },
  {
    fg: "text",
    bg: "down-wash",
    bgOver: "surface",
    min: TEXT_AA,
    reason: "The same size over the ask depth bar.",
  },
];

/** Borders, focus and non-text marks against the surfaces behind them.
 *
 * The up, down, bid and ask marks against a surface are the same colour
 * pairs the text rule already measures at 4.5:1, which is the stricter of
 * the two, so they are not repeated here. What is listed is the part of
 * those marks the text rule cannot see: the translucent washes. The accent
 * pairs are repeated, because the selected tab is a different promise from
 * accent used as text and Stage 2 may want to move only one of them. */
export const NON_TEXT_PAIRS = [
  { fg: "border-strong", bg: "surface", min: NON_TEXT, reason: "Boundary of a text field, a button and the slider track inside a panel: it is what identifies the control, so 1.4.11 applies." },
  { fg: "border-strong", bg: "bg", min: NON_TEXT, reason: "The same controls when they sit straight on the page background." },
  { fg: "focus", bg: "surface", min: NON_TEXT, reason: "Focus ring around a control inside a panel." },
  { fg: "focus", bg: "bg", min: NON_TEXT, reason: "Focus ring around a control on the page background." },
  { fg: "accent", bg: "surface", min: NON_TEXT, reason: "Underline of the selected tab, which is how the selected state is shown." },
  { fg: "accent", bg: "bg", min: NON_TEXT, reason: "The same tab indicator when the tab list sits straight on the page background." },
  {
    fg: "up-wash",
    bg: "surface",
    min: NON_TEXT,
    enforced: false,
    reason: "Bid depth bar the ladder fills over its surface, composited at the wash alpha; the bar length carries the quantity, so 1.4.11 is not claimed, and the ratio is reported only.",
  },
  {
    fg: "down-wash",
    bg: "surface",
    min: NON_TEXT,
    enforced: false,
    reason: "Ask depth bar, same reasoning as the bid bar.",
  },
  {
    fg: "border",
    bg: "surface",
    min: NON_TEXT,
    enforced: false,
    reason: "Panel boundary, table header rule and tab-list rule. They identify no control and carry no state, so 1.4.11 does not require 3:1; reported because a boundary nobody can see still costs scanning speed.",
  },
  {
    fg: "border",
    bg: "bg",
    min: NON_TEXT,
    enforced: false,
    reason: "The same rules on the page background; reported for the same reason.",
  },
];

/** The rising and falling colours, which have to stay apart under every
 * colour-vision model the checks simulate. The bid and ask colours are the
 * same two token values in both themes, so measuring them again would add
 * no number. */
export const UP_DOWN = {
  a: "up",
  b: "down",
  reason: "Rising against falling: the pair a trader reads first, and the one red-green dichromacy hits hardest.",
  contrastReason: "Rising against falling with hue removed: how far apart the two are in luminance alone.",
};

/** Size tokens measured against the target-size minimum, per density mode.
 *
 * Only row height is listed. Ladder and TradeTable have no pointer handlers
 * today, so no row is a pointer target yet and 2.5.8 does not apply to them
 * as drawn; the token is measured because row height is what the target will
 * be as soon as a row becomes interactive, and a mode that starts under the
 * minimum stays under it. Control sizes are not checked at all: there are no
 * control size tokens yet, so there is nothing for the rule to read. */
export const TARGETS = [
  {
    token: "density-row-height",
    min: TARGET_SIZE_PX,
    reason: "Height of a table and ladder row. It becomes the pointer target the moment a row is made interactive, so it is measured against 2.5.8 now rather than after the handler is added.",
  },
];

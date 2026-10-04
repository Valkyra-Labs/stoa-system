// Stoa's own words and number formats, by locale. The locale is React
// Aria's (`I18nProvider` above, `useLocale` here), so one provider sets the
// language of Stoa's text, the digits of its numbers and React Aria's own
// behaviour together.
//
// Digits follow the locale's numbering system, which a locale tag can
// state: "ar" alone formats with Latin digits in current ICU data, and
// "ar-u-nu-arab" with Arabic-Indic ones.
import { useMemo } from "react";
import { useLocale } from "react-aria-components";

export type StoaMessages = {
  time: string;
  side: string;
  price: string;
  size: string;
  buy: string;
  sell: string;
  /** The side of a ladder row as a word or a letter, so it is never told
   * by colour alone. */
  bidMark: string;
  askMark: string;
  bookEmpty: string;
  /** A trades table with no trades yet. */
  noTrades: string;
  /** A heatmap with nothing to draw. */
  noLiquidity: string;
  bestBid: (price: string, size: string) => string;
  bestAsk: (price: string, size: string) => string;
  noBids: string;
  noAsks: string;
  spread: (value: string) => string;
  /** One sentence from the bid part, the ask part and the spread, if any. */
  book: (bid: string, ask: string, spread: string | null) => string;
  /** What a loading placeholder says to assistive technology. */
  loading: string;
  /** A progress bar's value as an amount out of a total ("1.2 MB of 4.8 MB"). */
  progressOf: (value: string, max: string) => string;
  /** The tone of a callout or a toast as a word, read before its text, so
   * the tone is never told by colour alone. */
  toneInfo: string;
  tonePositive: string;
  toneWarning: string;
  toneNegative: string;
  /** The name of a button that closes a callout or a toast. */
  dismiss: string;
  /** The name of the region that holds the toasts. */
  notifications: string;
  /** The link that moves focus past the header to the main content. */
  skipToMain: string;
  /** The theme switch: its label and its two options. */
  theme: string;
  themeLight: string;
  themeDark: string;
  /** The language switch's label. */
  language: string;
  /** The space bar, in a shortcut's keys; the other keys keep the names
   * printed on them. */
  keySpace: string;
  /** The theme switch's first option: no theme chosen, follow the
   * system's light or dark setting. */
  themeSystem: string;
  // Overlays, lists and content.
  /** The close button of a dialog or a sheet. */
  close: string;
  /** The safe action of a confirmation. */
  cancel: string;
  copy: string;
  /** Announced, politely, after the text was copied. */
  copied: string;
  copyFailed: string;
  /** Names of an item's own buttons in a reorderable list. */
  moveUp: (item: string) => string;
  moveDown: (item: string) => string;
  remove: (item: string) => string;
  /** Announced after an item moved; position and total in the locale's
   * digits. */
  moved: (item: string, position: string, total: string) => string;
  removed: (item: string) => string;
  /** A reorderable list with no items. */
  listEmpty: string;
  /** The word for each step status, shown beside its symbol (StepList's
   * `StepStatus` is this record's keys). */
  stepStatus: Record<"waiting" | "running" | "done" | "awaiting" | "skipped" | "undone" | "error", string>;
};

const EN: StoaMessages = {
  time: "Time",
  side: "Side",
  price: "Price",
  size: "Size",
  buy: "Buy",
  sell: "Sell",
  bidMark: "B",
  askMark: "A",
  bookEmpty: "The book is empty.",
  noTrades: "No trades yet.",
  noLiquidity: "No liquidity to show.",
  bestBid: (price, size) => `best bid ${price} for ${size}`,
  bestAsk: (price, size) => `best ask ${price} for ${size}`,
  noBids: "no bids",
  noAsks: "no asks",
  spread: (value) => `spread ${value}`,
  book: (bid, ask, spread) => `${bid}, ${ask}${spread ? `, ${spread}` : ""}.`,
  loading: "Loading…",
  progressOf: (value, max) => `${value} of ${max}`,
  toneInfo: "Note",
  tonePositive: "Success",
  toneWarning: "Warning",
  toneNegative: "Error",
  dismiss: "Dismiss",
  notifications: "Notifications",
  skipToMain: "Skip to main content",
  theme: "Theme",
  themeLight: "Light",
  themeDark: "Dark",
  language: "Language",
  keySpace: "Space",
  themeSystem: "System",
  close: "Close",
  cancel: "Cancel",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Copy failed",
  moveUp: (item) => `Move up: ${item}`,
  moveDown: (item) => `Move down: ${item}`,
  remove: (item) => `Remove: ${item}`,
  moved: (item, position, total) => `${item} moved to position ${position} of ${total}.`,
  removed: (item) => `${item} removed.`,
  listEmpty: "No items.",
  stepStatus: {
    waiting: "Waiting",
    running: "Running",
    done: "Done",
    awaiting: "Awaiting decision",
    skipped: "Skipped",
    undone: "Undone",
    error: "Error",
  },
};

const AR: StoaMessages = {
  time: "الوقت",
  side: "الاتجاه",
  price: "السعر",
  size: "الحجم",
  buy: "شراء",
  sell: "بيع",
  bidMark: "شراء",
  askMark: "بيع",
  bookEmpty: "دفتر الأوامر فارغ.",
  noTrades: "لا صفقات بعد.",
  noLiquidity: "لا سيولة لعرضها.",
  bestBid: (price, size) => `أفضل سعر شراء ${price} بكمية ${size}`,
  bestAsk: (price, size) => `أفضل سعر بيع ${price} بكمية ${size}`,
  noBids: "لا أوامر شراء",
  noAsks: "لا أوامر بيع",
  spread: (value) => `الفارق ${value}`,
  book: (bid, ask, spread) => `${bid}، ${ask}${spread ? `، ${spread}` : ""}.`,
  loading: "جارٍ التحميل…",
  progressOf: (value, max) => `${value} من ${max}`,
  toneInfo: "ملاحظة",
  tonePositive: "تم بنجاح",
  toneWarning: "تحذير",
  toneNegative: "خطأ",
  dismiss: "إغلاق",
  notifications: "الإشعارات",
  skipToMain: "انتقل إلى المحتوى الرئيسي",
  theme: "المظهر",
  themeLight: "فاتح",
  themeDark: "داكن",
  language: "اللغة",
  keySpace: "مسافة",
  themeSystem: "النظام",
  close: "إغلاق",
  cancel: "إلغاء",
  copy: "نسخ",
  copied: "تم النسخ",
  copyFailed: "تعذر النسخ",
  moveUp: (item) => `تحريك للأعلى: ${item}`,
  moveDown: (item) => `تحريك للأسفل: ${item}`,
  remove: (item) => `إزالة: ${item}`,
  moved: (item, position, total) => `نُقل ${item} إلى الموضع ${position} من ${total}.`,
  removed: (item) => `أزيل ${item}.`,
  listEmpty: "لا عناصر.",
  stepStatus: {
    waiting: "في الانتظار",
    running: "قيد التنفيذ",
    done: "تم",
    awaiting: "بانتظار قرار",
    skipped: "تم التخطي",
    undone: "تم التراجع",
    error: "خطأ",
  },
};

const RU: StoaMessages = {
  time: "Время",
  side: "Сторона",
  price: "Цена",
  size: "Объём",
  buy: "Покупка",
  sell: "Продажа",
  bidMark: "Пок",
  askMark: "Прод",
  bookEmpty: "Стакан пуст.",
  noTrades: "Сделок пока нет.",
  noLiquidity: "Ликвидности для показа нет.",
  bestBid: (price, size) => `лучшая цена покупки ${price}, объём ${size}`,
  bestAsk: (price, size) => `лучшая цена продажи ${price}, объём ${size}`,
  noBids: "заявок на покупку нет",
  noAsks: "заявок на продажу нет",
  spread: (value) => `спред ${value}`,
  // The bid and ask parts carry their own commas, so semicolons join them.
  book: (bid, ask, spread) => `${bid}; ${ask}${spread ? `; ${spread}` : ""}.`,
  loading: "Загрузка…",
  progressOf: (value, max) => `${value} из ${max}`,
  toneInfo: "Примечание",
  tonePositive: "Готово",
  toneWarning: "Предупреждение",
  toneNegative: "Ошибка",
  dismiss: "Закрыть",
  notifications: "Уведомления",
  skipToMain: "Перейти к основному содержимому",
  theme: "Тема",
  themeLight: "Светлая",
  themeDark: "Тёмная",
  language: "Язык",
  keySpace: "Пробел",
  themeSystem: "Системная",
  close: "Закрыть",
  cancel: "Отмена",
  copy: "Копировать",
  copied: "Скопировано",
  copyFailed: "Не удалось скопировать",
  moveUp: (item) => `Переместить выше: ${item}`,
  moveDown: (item) => `Переместить ниже: ${item}`,
  remove: (item) => `Удалить: ${item}`,
  moved: (item, position, total) => `${item}: позиция ${position} из ${total}.`,
  removed: (item) => `${item}: удалено.`,
  listEmpty: "Элементов нет.",
  stepStatus: {
    waiting: "Ожидает",
    running: "Выполняется",
    done: "Готово",
    awaiting: "Ждёт решения",
    skipped: "Пропущено",
    undone: "Отменено",
    error: "Ошибка",
  },
};

/** Stoa's words for a locale: Arabic for any "ar" tag, Russian for any
 * "ru" tag, English otherwise. */
export function messagesFor(locale: string): StoaMessages {
  const language = locale.split("-")[0]?.toLowerCase();
  return language === "ar" ? AR : language === "ru" ? RU : EN;
}

export type StoaFormat = {
  locale: string;
  messages: StoaMessages;
  /** A number with a fixed count of decimals, in the locale's digits. */
  decimal(value: number, fractionDigits: number): string;
  /** A whole number with the locale's grouping and digits. */
  integer(value: number): string;
  /** A preformatted string (a time of day, for example) with its Latin
   * digits and decimal point rewritten in the locale's. */
  digits(text: string): string;
};

const formats = new Map<string, StoaFormat>();

/** The formats for a locale, built once per locale. */
export function stoaFormat(locale: string): StoaFormat {
  const cached = formats.get(locale);
  if (cached) return cached;
  const decimals = new Map<number, Intl.NumberFormat>();
  const decimalFormat = (fractionDigits: number) => {
    let format = decimals.get(fractionDigits);
    if (!format) {
      format = new Intl.NumberFormat(locale, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
      decimals.set(fractionDigits, format);
    }
    return format;
  };
  const integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const plain = new Intl.NumberFormat(locale, { useGrouping: false });
  const digitMap = new Map<string, string>(Array.from({ length: 10 }, (_, d) => [String(d), plain.format(d)]));
  const point = decimalFormat(1).formatToParts(1.5).find((part) => part.type === "decimal")?.value ?? ".";
  digitMap.set(".", point);
  const format: StoaFormat = {
    locale,
    messages: messagesFor(locale),
    decimal: (value, fractionDigits) => decimalFormat(fractionDigits).format(value),
    integer: (value) => integer.format(value),
    digits: (text) => text.replace(/[0-9.]/g, (character) => digitMap.get(character) ?? character),
  };
  formats.set(locale, format);
  return format;
}

/** The formats for the locale React Aria is set to. */
export function useStoaFormat(): StoaFormat {
  const { locale } = useLocale();
  return useMemo(() => stoaFormat(locale), [locale]);
}

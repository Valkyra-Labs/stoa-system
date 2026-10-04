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
  // Table and charts.
  /** A line chart with nothing to draw. */
  noChartData: string;
  /** The note under a chart whose value axis leaves zero out. */
  axisNotZero: (from: string, to: string) => string;
  /** The summary row that opens a chart's data table. */
  dataTable: string;
  /** One series in a line chart's text alternative: its first and last
   * values with where they fall on the time axis, and its range. */
  seriesSummary: (name: string, first: string, firstAt: string, last: string, lastAt: string, low: string, high: string) => string;
  /** The series sentences of a chart's text alternative, joined. */
  seriesList: (parts: string[]) => string;
  /** Which way time runs on a chart's time axis. */
  timeLeftToRight: string;
  timeRightToLeft: string;
  /** Kinds of event on an event strip. */
  coupon: string;
  amortisation: string;
  offer: string;
  maturity: string;
  /** A kind of event that happens more than once, with its count. */
  eventCount: (kind: string, count: string) => string;
  /** A kind of event that happens once, with its date. */
  eventOn: (kind: string, date: string) => string;
  /** An event strip's summary: its range and one part per kind. */
  eventSummary: (from: string, to: string, parts: string[]) => string;
  /** One event in an event strip's list alternative. */
  eventItem: (date: string, kind: string) => string;
  /** An event strip with no events. */
  noEvents: string;
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
  noChartData: "No data to show.",
  axisNotZero: (from, to) => `The value axis does not start at zero: it shows ${from} to ${to}.`,
  dataTable: "Data table",
  seriesSummary: (name, first, firstAt, last, lastAt, low, high) =>
    `${name}: from ${first} on ${firstAt} to ${last} on ${lastAt}, low ${low}, high ${high}`,
  seriesList: (parts) => `${parts.join("; ")}.`,
  timeLeftToRight: "Time runs from left to right.",
  timeRightToLeft: "Time runs from right to left.",
  coupon: "Coupon",
  amortisation: "Amortisation",
  offer: "Offer",
  maturity: "Maturity",
  eventCount: (kind, count) => `${kind}: ${count}`,
  eventOn: (kind, date) => `${kind} on ${date}`,
  eventSummary: (from, to, parts) => `From ${from} to ${to}: ${parts.join("; ")}.`,
  eventItem: (date, kind) => `${date}: ${kind}`,
  noEvents: "No events to show.",
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
  noChartData: "لا بيانات لعرضها.",
  axisNotZero: (from, to) => `محور القيم لا يبدأ من الصفر: يعرض من ${from} إلى ${to}.`,
  dataTable: "جدول البيانات",
  seriesSummary: (name, first, firstAt, last, lastAt, low, high) =>
    `${name}: من ${first} في ${firstAt} إلى ${last} في ${lastAt}، الأدنى ${low}، الأعلى ${high}`,
  seriesList: (parts) => `${parts.join("؛ ")}.`,
  timeLeftToRight: "يسير الزمن من اليسار إلى اليمين.",
  timeRightToLeft: "يسير الزمن من اليمين إلى اليسار.",
  coupon: "كوبون",
  amortisation: "إطفاء جزئي",
  offer: "عرض إعادة الشراء",
  maturity: "الاستحقاق",
  eventCount: (kind, count) => `${kind}: ${count}`,
  eventOn: (kind, date) => `${kind} في ${date}`,
  eventSummary: (from, to, parts) => `من ${from} إلى ${to}: ${parts.join("؛ ")}.`,
  eventItem: (date, kind) => `${date}: ${kind}`,
  noEvents: "لا أحداث لعرضها.",
};

/** Stoa's words for a locale: Arabic for any "ar" tag, English otherwise. */
export function messagesFor(locale: string): StoaMessages {
  return locale.split("-")[0]?.toLowerCase() === "ar" ? AR : EN;
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

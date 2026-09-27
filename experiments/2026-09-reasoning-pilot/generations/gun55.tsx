/*
 * Intent: monitor the book for what moved since yesterday's close, then
 * investigate the cause behind each notable move.
 * Information: entities = positions in the book; measures = last price,
 * price change and percent change since prior close; time frame = since
 * yesterday's close, as of the current session open; basis = prior close
 * for every delta shown, sector peers as the basis for context.
 * Decision: whether a move needs action (hedge, trim, escalate, or leave
 * alone) and what the PM needs beside the number to decide that:
 * provenance (the event driving the move), freshness (as-of time), and
 * history (the move plotted over the session and past sessions).
 * Pattern: Explorer (the whole book, exceptions first, filterable) with
 * an Inspector detail pane for the selected position (primary data,
 * context, history, actions), so drilling into a mover keeps the rest
 * of the book visible instead of replacing it.
 */

import {
  Page,
  Header,
  Explorer,
  Inspector,
  DataTable,
  FilterBar,
  SavedViews,
  Metric,
  Delta,
  Trend,
  Comparison,
  Timeline,
  Status,
  Button,
  BulkActions,
} from "@stoa/react";

const asOf = "9:31 AM ET";
const priorClose = "close, Sep 26 2026";

const positions = [
  {
    id: "nvda",
    ticker: "NVDA",
    name: "NVIDIA Corp",
    sector: "Semiconductors",
    position: "42,000 sh",
    lastPrice: "$121.84",
    changePct: "+6.8%",
    changeAbs: "+$7.76",
    exception: true,
  },
  {
    id: "tsla",
    ticker: "TSLA",
    name: "Tesla Inc",
    sector: "Auto Manufacturers",
    position: "18,500 sh",
    lastPrice: "$212.10",
    changePct: "-5.2%",
    changeAbs: "-$11.63",
    exception: true,
  },
  {
    id: "xom",
    ticker: "XOM",
    name: "Exxon Mobil Corp",
    sector: "Energy",
    position: "31,200 sh",
    lastPrice: "$118.42",
    changePct: "+2.1%",
    changeAbs: "+$2.44",
    exception: false,
  },
  {
    id: "jpm",
    ticker: "JPM",
    name: "JPMorgan Chase & Co",
    sector: "Banks",
    position: "9,800 sh",
    lastPrice: "$241.05",
    changePct: "-0.4%",
    changeAbs: "-$0.97",
    exception: false,
  },
  {
    id: "aapl",
    ticker: "AAPL",
    name: "Apple Inc",
    sector: "Technology",
    position: "26,000 sh",
    lastPrice: "$232.11",
    changePct: "+0.3%",
    changeAbs: "+$0.70",
    exception: false,
  },
  {
    id: "pfe",
    ticker: "PFE",
    name: "Pfizer Inc",
    sector: "Pharmaceuticals",
    position: "54,000 sh",
    lastPrice: "$24.98",
    changePct: "0.0%",
    changeAbs: "$0.00",
    exception: false,
  },
];

const nvdaIntraday = [
  { t: "9:30", v: 114.08 },
  { t: "9:45", v: 117.62 },
  { t: "10:00", v: 119.20 },
  { t: "10:15", v: 120.05 },
  { t: "10:30", v: 121.84 },
];

const nvdaPeers = {
  entities: ["NVDA", "AMD", "AVGO"],
  metrics: [
    { label: "Change since close", values: ["+6.8%", "+2.4%", "+1.9%"] },
    { label: "Volume vs 30d avg", values: ["3.1x", "1.4x", "1.2x"] },
    { label: "Implied vol move", values: ["+4.2 pts", "+1.1 pts", "+0.8 pts"] },
  ],
};

const nvdaEvents = [
  {
    time: "6:30 AM ET",
    label: "Q3 earnings beat: revenue +18% YoY, data center guidance raised",
  },
  {
    time: "7:15 AM ET",
    label: "Three sell-side desks raise price target after the print",
  },
  {
    time: "9:30 AM ET",
    label: "Opens up 6.8% on 3.1x average volume",
  },
];

const filters = [
  { id: "sector", label: "Sector", type: "select", options: ["All", "Semiconductors", "Energy", "Banks", "Technology", "Pharmaceuticals", "Auto Manufacturers"] },
  { id: "exceptionsOnly", label: "Exceptions only", type: "toggle" },
  { id: "since", label: "Since", type: "fixed", value: priorClose },
];

const savedViews = [
  { id: "full-book", label: "Full book" },
  { id: "movers", label: "Movers only" },
  { id: "watchlist", label: "My watchlist" },
];

const tableColumns = [
  { key: "ticker", label: "Ticker" },
  { key: "name", label: "Name" },
  { key: "sector", label: "Sector" },
  { key: "position", label: "Position", align: "right" },
  { key: "lastPrice", label: "Last", align: "right" },
  { key: "changeAbs", label: "Change", align: "right" },
  { key: "changePct", label: "% Since Close", align: "right" },
];

const bulkActions = [
  { id: "flag", label: "Flag for review" },
  { id: "export", label: "Export selection" },
];

export default function MorningBookReview() {
  return (
    <Page title="Morning Book Review">
      <Header
        title="Morning Book Review"
        subtitle={`What moved since ${priorClose}`}
        actions={
          <>
            <Status tone="neutral" label={`As of ${asOf}`} />
            <Button label="Refresh" onPress={() => {}} variant="secondary" />
          </>
        }
      />
      <Explorer
        toolbar={
          <>
            <FilterBar filters={filters} />
            <SavedViews views={savedViews} />
          </>
        }
        table={
          <>
            <DataTable
              columns={tableColumns}
              rows={positions}
              selectable
              stickyFirstColumn
              onRowSelect={() => {}}
            />
            <BulkActions actions={bulkActions} />
          </>
        }
        detail={
          <Inspector
            primary={
              <section>
                <h2>NVDA — NVIDIA Corp</h2>
                <Status tone="warning" label="Exception: largest mover in the book" />
                <Metric label="Last price" value="$121.84" unit="USD" />
                <Delta value="+6.8%" basis={priorClose} />
                <Trend series={nvdaIntraday} />
              </section>
            }
            context={
              <section>
                <h3>Versus semiconductor peers</h3>
                <Comparison entities={nvdaPeers.entities} metrics={nvdaPeers.metrics} />
              </section>
            }
            history={
              <section>
                <h3>Why it moved</h3>
                <Timeline events={nvdaEvents} />
              </section>
            }
            actions={
              <>
                <Button label="Escalate to PM meeting" onPress={() => {}} variant="primary" />
                <Button label="Add to hedge review" onPress={() => {}} variant="secondary" />
              </>
            }
          />
        }
      />
    </Page>
  );
}

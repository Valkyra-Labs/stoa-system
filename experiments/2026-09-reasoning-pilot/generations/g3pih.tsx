// Intent: investigate — the portfolio manager is looking for what changed
//   since yesterday's close and the cause behind each move, not just a
//   status check.
// Information: entities = held positions (symbol, name, sector); measures =
//   last price, $ change, % change, weight, volume vs. average; time frame =
//   since yesterday's close, as of this morning; basis = prior close, with
//   a per-row signal for moves that have a known cause (earnings, guidance,
//   analyst action, macro/sector).
// Decision: which positions need attention this morning and why, so the PM
//   can decide whether to act (trim, add, hedge) or leave it. Beside the
//   number: provenance (the event behind the move), freshness (news feed
//   staleness), and short intraday history for the selected position.
// Pattern: Explorer (toolbar with persistent filters + saved views, a
//   deltas-first table sorted by magnitude of move, and a detail pane that
//   opens beside the table — not instead of it — showing the evidence for
//   the selected position's move).

import { useState } from "react";
import {
  Page,
  Header,
  FilterBar,
  SavedViews,
  Explorer,
  DataTable,
  Metric,
  Delta,
  Trend,
  Timeline,
  Status,
  StaleData,
  Button,
} from "@stoa/react";

const positions = [
  {
    id: "NVDA",
    symbol: "NVDA",
    name: "NVIDIA Corp",
    sector: "Semiconductors",
    last: 187.42,
    changeAbs: -14.88,
    changePct: -7.4,
    weight: 8.9,
    volumeVsAvg: 2.3,
    signalTone: "critical" as const,
    signalLabel: "Guidance cut",
    series: [201.1, 200.3, 198.7, 194.2, 188.9, 190.5, 187.4],
  },
  {
    id: "JPM",
    symbol: "JPM",
    name: "JPMorgan Chase",
    sector: "Banks",
    last: 241.15,
    changeAbs: 6.32,
    changePct: 2.7,
    weight: 6.1,
    volumeVsAvg: 1.4,
    signalTone: "positive" as const,
    signalLabel: "Earnings beat",
    series: [232.4, 233.9, 235.1, 236.8, 238.0, 239.6, 241.2],
  },
  {
    id: "XOM",
    symbol: "XOM",
    name: "Exxon Mobil",
    sector: "Energy",
    last: 118.77,
    changeAbs: 3.05,
    changePct: 2.6,
    weight: 4.4,
    volumeVsAvg: 1.1,
    signalTone: "neutral" as const,
    signalLabel: "Sector move, crude +3%",
    series: [113.2, 114.0, 114.9, 115.8, 116.7, 117.9, 118.8],
  },
  {
    id: "PYPL",
    symbol: "PYPL",
    name: "PayPal Holdings",
    sector: "Payments",
    last: 62.18,
    changeAbs: -3.41,
    changePct: -5.2,
    weight: 3.2,
    volumeVsAvg: 1.8,
    signalTone: "warning" as const,
    signalLabel: "Analyst downgrade",
    series: [67.9, 67.1, 66.4, 65.0, 63.9, 62.9, 62.2],
  },
  {
    id: "UNH",
    symbol: "UNH",
    name: "UnitedHealth Group",
    sector: "Healthcare",
    last: 512.30,
    changeAbs: -1.85,
    changePct: -0.4,
    weight: 5.6,
    volumeVsAvg: 0.9,
    signalTone: "neutral" as const,
    signalLabel: "No news, in line with sector",
    series: [515.0, 514.6, 513.9, 514.2, 513.1, 512.8, 512.3],
  },
  {
    id: "MSFT",
    symbol: "MSFT",
    name: "Microsoft Corp",
    sector: "Software",
    last: 421.03,
    changeAbs: 0.62,
    changePct: 0.1,
    weight: 9.8,
    volumeVsAvg: 0.8,
    signalTone: "neutral" as const,
    signalLabel: "No news",
    series: [419.9, 420.1, 420.6, 420.4, 420.9, 420.7, 421.0],
  },
];

const eventsById: Record<string, { time: string; label: string }[]> = {
  NVDA: [
    { time: "06:12", label: "Q3 guidance issued below consensus (data center growth slowing)" },
    { time: "06:40", label: "Three sell-side desks cut price target pre-market" },
    { time: "07:55", label: "Pre-market volume already 2.3x 20-day average" },
  ],
  JPM: [
    { time: "06:30", label: "Q3 EPS beats consensus by $0.18, NII guidance raised" },
    { time: "07:10", label: "CFO commentary on call: credit costs below plan" },
  ],
  XOM: [
    { time: "05:45", label: "WTI crude +3.1% overnight on supply disruption headlines" },
    { time: "07:00", label: "Energy sector broadly higher, no company-specific news" },
  ],
  PYPL: [
    { time: "06:05", label: "Downgraded to Underweight, price target cut to $58" },
    { time: "06:05", label: "Note cites take-rate compression in branded checkout" },
  ],
  UNH: [],
  MSFT: [],
};

export default function MorningBookReview() {
  const [selectedId, setSelectedId] = useState(positions[0].id);
  const selected = positions.find((p) => p.id === selectedId) ?? positions[0];
  const selectedEvents = eventsById[selected.id] ?? [];

  return (
    <Page title="Morning Book Review">
      <Header
        title="Morning Book Review"
        subtitle="As of 8:32 AM ET · vs yesterday's close"
        actions={[<Button key="refresh" label="Refresh prices" onPress={() => {}} />]}
      />

      <Explorer
        toolbar={
          <>
            <FilterBar
              filters={[
                { id: "moveSize", label: "Move ≥ 2%", active: true },
                { id: "sector", label: "Sector: All", active: false },
                { id: "assetClass", label: "Asset class: Equity", active: false },
                { id: "hasSignal", label: "Has known cause", active: false },
              ]}
            />
            <SavedViews
              views={[
                { id: "movers", label: "Today's movers", active: true },
                { id: "fullBook", label: "Full book" },
                { id: "watchlist", label: "Watchlist" },
              ]}
            />
          </>
        }
        table={
          <DataTable
            columns={[
              { id: "symbol", label: "Symbol" },
              { id: "name", label: "Name" },
              { id: "sector", label: "Sector" },
              { id: "last", label: "Last", align: "right" },
              { id: "change", label: "Change vs. prior close", align: "right" },
              { id: "weight", label: "Book weight", align: "right" },
              { id: "volumeVsAvg", label: "Volume vs. avg", align: "right" },
              { id: "signal", label: "Signal" },
            ]}
            rows={positions
              .slice()
              .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
              .map((p) => ({
                id: p.id,
                symbol: p.symbol,
                name: p.name,
                sector: p.sector,
                last: p.last.toFixed(2),
                change: (
                  <Delta
                    value={p.changePct}
                    basis={`${p.changeAbs >= 0 ? "+" : ""}${p.changeAbs.toFixed(2)} vs. prior close`}
                  />
                ),
                weight: `${p.weight.toFixed(1)}%`,
                volumeVsAvg: `${p.volumeVsAvg.toFixed(1)}x`,
                signal: <Status tone={p.signalTone} label={p.signalLabel} />,
              }))}
            selectable
            stickyFirstColumn
            onRowSelect={(id: string) => setSelectedId(id)}
          />
        }
        detail={
          <>
            <Header
              title={`${selected.symbol} — ${selected.name}`}
              subtitle={selected.sector}
            />

            <Metric
              label="Last price"
              value={selected.last.toFixed(2)}
              unit="USD"
              delta={
                <Delta
                  value={selected.changePct}
                  basis={`${selected.changeAbs >= 0 ? "+" : ""}${selected.changeAbs.toFixed(2)} vs. prior close`}
                />
              }
            />

            <Trend series={selected.series} />

            {selectedEvents.length > 0 ? (
              <Timeline events={selectedEvents} />
            ) : (
              <Status tone="neutral" label="No company-specific events found this morning" />
            )}

            <StaleData since="07:58 AM ET" />
          </>
        }
      />
    </Page>
  );
}

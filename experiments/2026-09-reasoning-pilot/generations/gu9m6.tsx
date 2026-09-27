// Goal: let a portfolio manager, first thing in the morning, see what in
// their book moved overnight and understand why - fast, before the market
// opens. The layout starts with a book-level scorecard (is today good or
// bad, and by how much), narrows immediately into the movers and exceptions
// that explain most of that scorecard, then offers the full position list
// with a driver noted on every row so "why" never requires a click. A
// drawer gives one flagged position a deeper look (price trend, news,
// trade history) without leaving the page, and the overnight trade log at
// the bottom explains the moves that were self-inflicted rather than
// market-driven.
import {
  Page,
  Header,
  Section,
  Card,
  Drawer,
  Metric,
  Delta,
  Trend,
  Chart,
  DataTable,
  Timeline,
  AuditLog,
  Status,
  FilterBar,
  SavedViews,
  Button,
  BulkActions,
  Inspector,
  Monitor,
} from "@stoa/react";

export default function MorningBookReview() {
  const positions = [
    {
      ticker: "NVDA",
      name: "NVIDIA Corp",
      sector: "Semiconductors",
      last: "$121.84",
      chg: "+$7.92",
      chgPct: "+6.9%",
      pnl: "+$612,400",
      weight: "8.4%",
      why: "Beat on data-center revenue, raised guidance",
    },
    {
      ticker: "META",
      name: "Meta Platforms",
      sector: "Interactive Media",
      last: "$298.10",
      chg: "-$14.55",
      chgPct: "-4.7%",
      pnl: "-$318,900",
      weight: "5.1%",
      why: "Downgraded to Underweight at Morgan Stanley",
    },
    {
      ticker: "XOM",
      name: "Exxon Mobil",
      sector: "Energy",
      last: "$112.02",
      chg: "+$3.10",
      chgPct: "+2.8%",
      pnl: "+$96,300",
      weight: "3.2%",
      why: "Brent crude up on OPEC+ supply cut",
    },
    {
      ticker: "TSLA",
      name: "Tesla Inc",
      sector: "Automobiles",
      last: "$187.55",
      chg: "-$9.80",
      chgPct: "-5.0%",
      pnl: "-$221,600",
      weight: "4.0%",
      why: "Q1 deliveries missed consensus",
    },
    {
      ticker: "JPM",
      name: "JPMorgan Chase",
      sector: "Banks",
      last: "$204.31",
      chg: "+$1.12",
      chgPct: "+0.6%",
      pnl: "+$18,700",
      weight: "6.0%",
      why: "In line with sector, no company news",
    },
    {
      ticker: "AMZN",
      name: "Amazon.com",
      sector: "Broadline Retail",
      last: "$186.40",
      chg: "+$2.05",
      chgPct: "+1.1%",
      pnl: "+$54,200",
      weight: "5.6%",
      why: "AWS growth commentary from a peer read-through",
    },
    {
      ticker: "PFE",
      name: "Pfizer Inc",
      sector: "Pharmaceuticals",
      last: "$26.18",
      chg: "-$1.44",
      chgPct: "-5.2%",
      pnl: "-$132,800",
      weight: "2.1%",
      why: "Trial readout fell short of endpoint",
    },
    {
      ticker: "SHORT: RIVN",
      name: "Rivian Automotive",
      sector: "Automobiles",
      last: "$11.02",
      chg: "-$0.68",
      chgPct: "-5.8%",
      pnl: "+$61,100",
      weight: "-1.8%",
      why: "Production guidance cut, short benefiting",
    },
  ];

  const columns = [
    { key: "ticker", label: "Position" },
    { key: "sector", label: "Sector" },
    { key: "last", label: "Last" },
    { key: "chg", label: "Chg" },
    { key: "chgPct", label: "Chg %" },
    { key: "pnl", label: "Day P&L" },
    { key: "weight", label: "Weight" },
    { key: "why", label: "Why it moved" },
  ];

  const rows = positions.map((p) => ({
    ticker: p.ticker,
    sector: p.sector,
    last: p.last,
    chg: p.chg,
    chgPct: p.chgPct,
    pnl: p.pnl,
    weight: p.weight,
    why: p.why,
  }));

  const overnightTrades = [
    {
      who: "D. Alvarez",
      what: "Trimmed META by 15% into the downgrade",
      when: "6:41 AM ET",
    },
    {
      who: "D. Alvarez",
      what: "Added to NVDA on the pre-market pop",
      when: "6:58 AM ET",
    },
    {
      who: "System",
      what: "Auto-hedged sector beta after NVDA add",
      when: "7:02 AM ET",
    },
    {
      who: "R. Okafor",
      what: "Initiated short in RIVN ahead of guidance",
      when: "Yesterday, 3:52 PM ET",
    },
  ];

  const nvdaNews = [
    {
      time: "4:05 PM ET yesterday",
      label: "Q1 earnings released after close",
    },
    {
      time: "4:32 PM ET yesterday",
      label: "Data-center revenue beats consensus by 12%",
    },
    {
      time: "5:10 PM ET yesterday",
      label: "Guidance raised for next quarter",
    },
    {
      time: "7:15 AM ET today",
      label: "Three sell-side price target increases",
    },
  ];

  return (
    <Page title="Morning Book Review">
      <Header
        title="Morning Book Review"
        subtitle="Global Equity Long/Short · As of 7:58 AM ET, Tuesday"
        actions={[
          <Button label="Refresh" onPress={() => {}} />,
          <Button label="Export summary" onPress={() => {}} variant="secondary" />,
        ]}
      />

      <Section title="Book at a glance">
        <Metric label="Net asset value" value="$284.6M" delta="+$1.42M vs prior close" />
        <Metric label="Day P&L" value="+$1.42M" unit="USD" delta="+0.50% vs NAV" />
        <Metric label="Gross exposure" value="164%" delta="-1.1pt vs prior close" />
        <Metric label="Positions moved >2%" value="6 of 8" delta="+3 vs yesterday" />
        <Trend series={[281.9, 282.4, 282.1, 283.0, 284.6]} />
        <Chart
          type="line"
          series={[
            { time: "6:00 AM", value: 283.18 },
            { time: "6:30 AM", value: 283.4 },
            { time: "7:00 AM", value: 282.7 },
            { time: "7:30 AM", value: 283.9 },
            { time: "8:00 AM", value: 284.6 },
          ]}
          x="time"
          y="value"
        />
      </Section>

      <Section title="What moved overnight">
        <Monitor
          signals={[
            { label: "NVDA", value: "+6.9%", basis: "Earnings beat, guidance raised" },
            { label: "TSLA", value: "-5.0%", basis: "Deliveries missed consensus" },
            { label: "PFE", value: "-5.2%", basis: "Trial readout fell short" },
          ]}
          exceptions={[
            {
              label: "PFE breached single-name loss limit",
              tone: "critical",
            },
            {
              label: "Sector beta hedge auto-adjusted after NVDA add",
              tone: "info",
            },
          ]}
        />
      </Section>

      <Section title="Positions">
        <FilterBar
          filters={[
            { id: "sector", label: "Sector", type: "select" },
            { id: "direction", label: "Long / Short", type: "select" },
            { id: "movedOnly", label: "Moved > 2% only", type: "toggle" },
          ]}
        />
        <SavedViews
          views={[
            { id: "default", label: "All positions", isActive: true },
            { id: "movers", label: "Today's movers" },
            { id: "shorts", label: "Short book" },
          ]}
        />
        <DataTable
          columns={columns}
          rows={rows}
          selectable
          stickyFirstColumn
          onRowSelect={() => {}}
        />
        <BulkActions
          actions={[
            { id: "flag", label: "Flag for review" },
            { id: "note", label: "Add note" },
          ]}
        />
      </Section>

      <Drawer title="NVDA · NVIDIA Corp" open={true}>
        <Inspector
          primary={
            <Card title="Price since close">
              <Metric label="Last" value="$121.84" delta="+6.9% overnight" />
              <Chart
                type="line"
                series={[
                  { time: "Close", value: 113.92 },
                  { time: "6:00 AM", value: 116.4 },
                  { time: "7:00 AM", value: 119.8 },
                  { time: "8:00 AM", value: 121.84 },
                ]}
                x="time"
                y="value"
              />
            </Card>
          }
          context={
            <Card title="Position context">
              <Metric label="Book weight" value="8.4%" />
              <Metric label="Day P&L" value="+$612,400" />
              <Status tone="positive" label="Within risk limits" />
            </Card>
          }
          history={<Timeline events={nvdaNews} />}
          actions={[
            <Button label="Flag for review" onPress={() => {}} />,
            <Button label="Add note" onPress={() => {}} variant="secondary" />,
          ]}
        />
      </Drawer>

      <Section title="Overnight trade activity">
        <AuditLog entries={overnightTrades} />
      </Section>
    </Page>
  );
}

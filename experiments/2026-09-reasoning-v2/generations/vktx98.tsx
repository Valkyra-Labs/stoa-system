import { Page, Header, Section, Card, Comparison, DataTable, Timeline, Metric, Delta, Status, EmptyData } from "@stoa/react";

const assets = [
  { id: "AAPL", name: "Apple Inc.", change: 2.5, reason: "Strong Q3 earnings report", delta: 1.2, basis: 120.0 },
  { id: "TSLA", name: "Tesla Inc.", change: -4.8, reason: "Production slowdown in China", delta: -2.3, basis: 210.0 },
  { id: "AMZN", name: "Amazon.com", change: 1.8, reason: "Improved supply chain efficiency", delta: 0.9, basis: 130.0 },
  { id: "GOOGL", name: "Alphabet Inc.", change: -1.2, reason: "Regulatory concerns in EU", delta: -0.6, basis: 110.0 },
  { id: "NVDA", name: "NVIDIA Corp.", change: 3.7, reason: "AI demand surges", delta: 1.8, basis: 90.0 },
];

const today = new Date();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const todayDate = today.toLocaleDateString();
const yesterdayDate = yesterday.toLocaleDateString();

const portfolio = {
  totalValue: 100000,
  gain: 1500,
  loss: 2000,
  overallDelta: -500,
  overallBasis: 100000,
};

const events = [
  { time: "09:15 AM", description: "Apple reports Q3 earnings, +2.5% in value" },
  { time: "10:30 AM", description: "Tesla production slowdown in China, -4.8% in value" },
  { time: "11:45 AM", description: "Amazon improves supply chain efficiency, +1.8% in value" },
  { time: "01:00 PM", description: "Alphabet faces regulatory concerns in EU, -1.2% in value" },
  { time: "02:15 PM", description: "NVIDIA sees AI demand surge, +3.7% in value" },
];

export default function PortfolioOverview() {
  return (
    <Page title="Portfolio Overview" subtitle={`As of ${todayDate}`}>
      <Header
        title="Portfolio Changes Since Yesterday"
        subtitle={`Comparing ${todayDate} vs ${yesterdayDate}`}
        actions={
          <div className="flex gap-2">
            <Button label="Refresh" variant="primary" />
            <Button label="Export" variant="secondary" />
          </div>
        }
      />
      <Section title="Overall Portfolio Performance">
        <Card>
          <Metric label="Total Value" value={portfolio.totalValue} unit="$" />
          <Metric label="Daily Gain" value={portfolio.gain} unit="$" delta={<Delta value={portfolio.gain} basis={portfolio.overallBasis} />} />
          <Metric label="Daily Loss" value={portfolio.loss} unit="$" delta={<Delta value={portfolio.loss} basis={portfolio.overallBasis} />} />
          <Metric label="Overall Delta" value={portfolio.overallDelta} unit="$" delta={<Delta value={portfolio.overallDelta} basis={portfolio.overallBasis} />} />
        </Card>
      </Section>
      <Section title="Key Asset Changes">
        <Comparison
          entities={assets.map(asset => asset.name)}
          metrics={[
            {
              label: "Change",
              values: assets.map(asset => asset.change),
              delta: assets.map(asset => asset.delta),
              basis: assets.map(asset => asset.basis),
            },
            {
              label: "Reason",
              values: assets.map(asset => asset.reason),
            },
          ]}
        />
      </Section>
      <Section title="Timeline of Changes">
        <Timeline events={events} />
      </Section>
      <Section title="Full Portfolio View">
        <DataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "change", label: "Change", format: value => <Delta value={value} basis={100} /> },
            { key: "reason", label: "Reason" },
          ]}
          rows={assets}
          selectable
          stickyFirstColumn
          onRowSelect={id => alert(`Selected asset: ${id}`)}
        />
      </Section>
    </Page>
  );
}

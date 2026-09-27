import { Page, Header, Section, Card, Tabs, DataTable, Metric, Delta, Timeline, FilterBar, Button, Status } from "@stoa/react";

const portfolioData = [
  { id: "AAPL", name: "Apple Inc.", change: 2.5, reason: "Strong Q3 earnings", delta: 1.2, unit: "%" },
  { id: "TSLA", name: "Tesla Inc.", change: -4.3, reason: "Production slowdown", delta: -2.1, unit: "%" },
  { id: "GOOGL", name: "Alphabet Inc.", change: 0.8, reason: "Positive analyst ratings", delta: 0.4, unit: "%" },
  { id: "AMZN", name: "Amazon.com Inc.", change: -1.5, reason: "Supply chain delays", delta: -0.7, unit: "%" },
  { id: "NVDA", name: "NVIDIA Corporation", change: 3.2, reason: "AI demand surge", delta: 1.8, unit: "%" },
];

const timelineEvents = [
  { time: "2023-10-05 09:30", description: "Apple reports Q3 earnings, +2.5% in AAPL" },
  { time: "2023-10-05 10:15", description: "Tesla production delays reported, -4.3% in TSLA" },
  { time: "2023-10-05 11:45", description: "Alphabet receives positive analyst ratings, +0.8% in GOOGL" },
  { time: "2023-10-05 13:20", description: "Amazon supply chain delays announced, -1.5% in AMZN" },
  { time: "2023-10-05 14:00", description: "NVIDIA sees AI demand surge, +3.2% in NVDA" },
];

const PortfolioOverview = () => {
  return (
    <Page title="Portfolio Changes - Morning Review">
      <Header
        title="What Moved Since Yesterday"
        subtitle="Review of portfolio changes and reasons for movements"
        actions={
          <FilterBar>
            <Button label="All" />
            <Button label="Today" />
            <Button label="Last Week" />
          </FilterBar>
        }
      />
      <Section title="Overview">
        <Card>
          <Metric label="Total Value" value="$12,450,000" unit="USD" />
          <Metric label="Gains" value="2.5%" delta={1.2} unit="%" />
          <Metric label="Losses" value="4.3%" delta={-2.1} unit="%" />
        </Card>
        <Card>
          <h3>Performance Trend</h3>
          <Chart type="line" series={[{ name: "Portfolio", data: [2.5, -4.3, 0.8, -1.5, 3.2] }]} />
        </Card>
      </Section>
      <Section title="Portfolio Changes">
        <DataTable
          columns={[
            { key: "name", label: "Asset" },
            { key: "change", label: "Change" },
            { key: "reason", label: "Reason" },
          ]}
          rows={portfolioData}
          selectable
        />
      </Section>
      <Section title="Timeline of Changes">
        <Timeline events={timelineEvents} />
      </Section>
    </Page>
  );
};

export default PortfolioOverview;

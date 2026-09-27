import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Delta, DataTable, Timeline, EmptyData, Button, FilterBar, SavedViews } from "@stoa/react";

const PortfolioChanges = () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const assets = [
    { id: "AS1", name: "Apple Inc.", value: 192.34, delta: 2.15, reason: "Market rebound" },
    { id: "AS2", name: "Tesla Inc.", value: 245.67, delta: -4.32, reason: "Production delay" },
    { id: "AS3", name: "Microsoft Corp.", value: 310.89, delta: 1.23, reason: "New product launch" },
    { id: "AS4", name: "Meta Platforms", value: 300.45, delta: -1.89, reason: "Regulatory concerns" },
    { id: "AS5", name: "Amazon.com", value: 135.78, delta: 0.98, reason: "Inventory adjustments" },
  ];

  const events = [
    { time: "09:15 AM", description: "Apple Inc. value increased due to market rebound." },
    { time: "10:30 AM", description: "Tesla Inc. value decreased due to production delay announcement." },
    { time: "11:45 AM", description: "Microsoft Corp. value increased following new product launch." },
    { time: "01:00 PM", description: "Meta Platforms value decreased due to regulatory concerns." },
    { time: "02:30 PM", description: "Amazon.com value increased after inventory adjustments." },
  ];

  return (
    <Page title="Portfolio Changes">
      <Header title="Portfolio Changes" subtitle={`Since ${yesterday.toDateString()}`} actions={<Button label="Refresh" />} />
      <Sidebar>
        <FilterBar filters={[{ label: "All", value: "all" }, { label: "Positive", value: "positive" }, { label: "Negative", value: "negative" }]} />
        <SavedViews views={["Daily", "Weekly", "Monthly"]} />
      </Sidebar>
      <main>
        <Section title="Summary Metrics">
          <Card title="Total Value">
            <Metric label="Today" value={1000000} unit="USD" />
            <Metric label="Yesterday" value={980000} unit="USD" />
            <Delta value={20000} basis={980000} />
          </Card>
          <Card title="Top Gainers">
            <DataTable
              columns={[{ header: "Asset", key: "name" }, { header: "Change", key: "delta" }, { header: "Reason", key: "reason" }]}
              rows={assets.filter(a => a.delta > 0).slice(0, 3)}
            />
          </Card>
          <Card title="Top Losers">
            <DataTable
              columns={[{ header: "Asset", key: "name" }, { header: "Change", key: "delta" }, { header: "Reason", key: "reason" }]}
              rows={assets.filter(a => a.delta < 0).slice(0, 3)}
            />
          </Card>
        </Section>
        <Section title="Timeline of Changes">
          <Timeline events={events} />
        </Section>
      </main>
    </Page>
  );
};

export default PortfolioChanges;

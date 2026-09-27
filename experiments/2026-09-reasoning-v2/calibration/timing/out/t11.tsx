import { Page, Header, Section, Card, Metric, Delta, Trend, DataTable, FilterBar, Button } from "@stoa/react";

export default function MorningDashboard() {
  return (
    <Page title="Morning Dashboard">
      <Header title="Morning Dashboard" subtitle="Review portfolio performance since yesterday" actions={<Button label="Refresh" />} />
      <Section title="Overview">
        <Card title="Portfolio Performance">
          <Metric label="Total Value" value="$1,050,000" delta={<Delta value={5000} basis="$1,045,000"} unit="USD" />
          <Metric label="Gains/Losses" value="+2.0%" delta={<Delta value={-0.5} basis="+2.5%"} unit="%" />
        </Card>
        <Trend series={[{ x: "2023-10-01", y: 1000 }, { x: "2023-10-02", y: 1050 }, { x: "2023-10-03", y: 1045 }, { x: "2023-10-04", y: 1050 }]} />
      </Section>
      <Section title="Top Movers">
        <DataTable
          columns={[
            { label: "Security", key: "security" },
            { label: "Change", key: "change" },
            { label: "Contribution", key: "contribution" },
          ]}
          rows={[
            { security: "AAPL", change: "+3.0%", contribution: "+1000" },
            { security: "GOOGL", change: "-1.5%", contribution: "-500" },
            { security: "MSFT", change: "+2.5%", contribution: "+750" },
          ]}
        />
      </Section>
      <Section title="Market Insights">
        <Card title="Market Conditions">
          <p>Today's market is characterized by...</p>
        </Card>
        <Card title="Recent Events">
          <p>Significant events affecting the market include...</p>
        </Card>
      </Section>
    </Page>
  );
}

import { Page, Header, Section, Card, Metric, Delta, Comparison, Timeline, AuditLog, Status, StaleData, FilterBar, Button, BulkActions } from "@stoa/react";

const PortfolioOverview = () => {
  return (
    <Page title="Portfolio Overview">
      <Header title="Portfolio Summary" subtitle="What moved since yesterday" actions={<Button label="Refresh" />} />
      <FilterBar filters={[{ label: "All", value: "all" }, { label: "Equities", value: "equities" }, { label: "Fixed Income", value: "fixed-income" }]} />
      
      <Section title="Top Changes">
        <Comparison
          entities={[{ id: "AAPL", name: "Apple Inc." }, { id: "TSLA", name: "Tesla Inc." }, { id: "GOOGL", name: "Alphabet Inc." }]}
          metrics={[
            { label: "Price Change", value: 5.2, basis: 3.8, unit: "%" },
            { label: "Volume Change", value: 12000, basis: 8000, unit: "M" },
            { label: "Market Cap Change", value: 250000, basis: 200000, unit: "M" }
          ]}
        />
      </Section>

      <Section title="Key Metrics">
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <Metric label="Total Value" value="12,500,000" unit="USD" />
          <Metric label="Yield" value="3.2%" unit="%" />
          <Metric label="Risk Score" value="72" />
          <Metric label="Drawdown" value="4.5%" unit="%" />
        </div>
      </Section>

      <Section title="Recent Activity">
        <Timeline
          events={[
            { time: "09:15", description: "Apple (AAPL) price up 5.2% on earnings report" },
            { time: "09:30", description: "Tesla (TSLA) volume spikes 12,000M due to new product launch" },
            { time: "10:00", description: "Alphabet (GOOGL) market cap rises 250M due to strategic investment" }
          ]}
        />
      </Section>

      <Section title="Audit Trail">
        <AuditLog
          entries={[
            { user: "admin", action: "updated portfolio", time: "08:45" },
            { user: "manager", action: "added position", time: "09:05" },
            { user: "admin", action: "removed position", time: "09:20" }
          ]}
        />
      </Section>

      <Section title="Stale Data">
        <StaleData since="2023-10-05T15:30:00Z" />
      </Section>

      <Section title="Actions">
        <BulkActions>
          <Button label="Sell Underperformers" />
          <Button label="Rebalance Portfolio" />
        </BulkActions>
      </Section>
    </Page>
  );
};

export default PortfolioOverview;

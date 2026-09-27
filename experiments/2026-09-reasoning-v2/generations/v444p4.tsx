import { Page, Header, Card, Section, Tabs, Comparison, Chart, DataTable, Status } from "@stoa/react";

export default function MorningReview() {
  return (
    <Page title="Morning Review">
      <Header title="Morning Review" subtitle="Changes since yesterday" />
      <Section title="Portfolio Changes">
        <Card title="Summary">
          <Comparison
            entities={[
              { id: "portfolio", metrics: ["total_return", "volatility", "top_asset_shift"] }
            ]}
          />
        </Card>
      </Section>
      <Section title="Reasons for Changes">
        <Tabs items={[
          { id: "market", label: "Market Events", content: <Chart type="line" series={["price", "volume"]} x="date" y="value" /> },
          { id: "economic", label: "Economic Indicators", content: <DataTable columns={["indicator", "value", "trend"]} rows={[["interest_rate", "5.25%", "up"], ["inflation", "2.0%", "down"]]} /> },
          { id: "trading", label: "Trading Activities", content: <DataTable columns={["asset", "quantity", "price"]} rows={[["AAPL", "1000", "$150.00"], ["GOOGL", "500", "$2500.00"]]} />}
        ]} />
      </Section>
    </Page>
  );
}

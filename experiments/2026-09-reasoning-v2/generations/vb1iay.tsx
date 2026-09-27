import { Page, Header, Metric, Comparison, Chart, AuditLog } from "@stoa/react";

const PortfolioOverview = () => {
  return (
    <Page title="Portfolio Overview">
      <Header title="Portfolio Overview" subtitle="Daily Performance" />
      <Metric label="Overall Performance" value={1.23} delta={0.05} unit="%" />
      <Comparison
        entities={[
          { id: "AAPL", label: "Apple Inc.", metrics: [{ label: "Price", value: 150.25, delta: 1.25 }] },
          { id: "MSFT", label: "Microsoft Corp.", metrics: [{ label: "Price", value: 250.50, delta: -2.75 }] }
        ]}
      />
      <Chart
        type="line"
        series={[
          { label: "AAPL Price", data: [{ x: "2023-10-01", y: 149.00 }, { x: "2023-10-02", y: 150.25 }] },
          { label: "MSFT Price", data: [{ x: "2023-10-01", y: 253.25 }, { x: "2023-10-02", y: 250.50 }] }
        ]}
        x="date"
        y="price"
      />
      <AuditLog
        entries={[
          { time: "2023-10-02T10:00:00Z", user: "Alice", action: "Bought 100 shares of AAPL" },
          { time: "2023-10-02T11:30:00Z", user: "Bob", action: "Sold 50 shares of MSFT" }
        ]}
      />
    </Page>
  );
};

export default PortfolioOverview;

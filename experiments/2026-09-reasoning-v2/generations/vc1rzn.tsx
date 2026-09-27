import { Page, Sidebar, Header, Comparison, Chart, DataTable, Button } from "@stoa/react";

export default function FundRecommendation() {
  return (
    <Page title="Fund Recommendation">
      <Header title="Fund Recommendation" subtitle="Choose the best fund for the client" />
      <div style={{ display: "flex" }}>
        <Sidebar>
          <Button label="Go Back" variant="secondary" />
        </Sidebar>
        <main style={{ flex: 1, padding: "16px" }}>
          <Comparison
            entities={[
              { id: "fundA", label: "Fund A" },
              { id: "fundB", label: "Fund B" },
            ]}
            metrics={[
              { id: "performance", label: "Performance", unit: "%" },
              { id: "risk", label: "Risk", unit: "%" },
              { id: "liquidity", label: "Liquidity", unit: "%" },
            ]}
            evidence={[
              { id: "fundA", content: <Chart type="line" series={[]} x="date" y="value" /> },
              { id: "fundB", content: <Chart type="line" series={[]} x="date" y="value" /> },
            ]}
          />
          <DataTable
            columns={[
              { id: "date", label: "Date", sortable: true },
              { id: "value", label: "Value", sortable: true, numeric: true },
              { id: "change", label: "Change", sortable: true, numeric: true },
            ]}
            rows={[
              { id: "1", date: "2023-01-01", value: 100, change: 2 },
              { id: "2", date: "2023-02-01", value: 102, change: 1.5 },
              { id: "3", date: "2023-03-01", value: 103.5, change: 1.5 },
            ]}
          />
        </main>
      </div>
    </Page>
  );
}

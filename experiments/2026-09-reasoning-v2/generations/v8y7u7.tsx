import { Page, Header, Sidebar, Section, Card, Chart, DataTable, Comparison, Button } from "@stoa/react";

export default function FundComparison() {
  return (
    <Page title="Fund Comparison">
      <Header title="Compare Funds" subtitle="Choose the best fund for your client" />
      <Sidebar>
        <Button label="Back to Dashboard" variant="secondary" />
        <Button label="Recommend Fund" variant="primary" />
      </Sidebar>
      <main>
        <Section title="Fund Comparison">
          <Comparison
            entities={[
              { id: "fund1", label: "Growth Fund" },
              { id: "fund2", label: "Stability Fund" }
            ]}
            metrics={[
              { id: "returns", label: "1-Year Returns", unit: "%" },
              { id: "risk", label: "Risk Rating", unit: "1-5" },
              { id: "fees", label: "Annual Fees", unit: "%" }
            ]}
          >
            <Chart type="line" series={{ data: [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]] }} x="Month" y="Returns" />
            <Chart type="bar" series={{ data: [[1, 2, 3], [2, 3, 4]] }} x="Month" y="Risk" />
            <DataTable
              columns={[
                { label: "Month", key: "month" },
                { label: "Fees", key: "fees" }
              ]}
              rows={[
                { month: "Jan", fees: 0.5 },
                { month: "Feb", fees: 0.5 },
                { month: "Mar", fees: 0.5 },
                { month: "Apr", fees: 0.5 },
                { month: "May", fees: 0.5 }
              ]}
            />
          </Comparison>
        </Section>
      </main>
    </Page>
  );
}

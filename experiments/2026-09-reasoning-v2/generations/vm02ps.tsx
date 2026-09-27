import { Page, Header, Card, Metric, Delta, DataTable } from "@stoa/react";

export default function FinanceOverview() {
  return (
    <Page title="Finance Overview">
      <Header title="Weekly Financial Summary" subtitle="As of Monday, March 20, 2023" />
      <main>
        <section>
          <Card title="Revenue">
            <Metric label="Total Revenue" value={1200000} delta={-50000} basis={1250000} unit="USD" />
            <Metric label="YoY Growth" value={-2.5} delta={-1.2} basis={3.7} unit="%" />
          </Card>
          <Card title="Expenses">
            <Metric label="Total Expenses" value={800000} delta={10000} basis={790000} unit="USD" />
            <Metric label="YoY Growth" value={3.0} delta={0.5} basis={2.5} unit="%" />
          </Card>
        </section>
        <section>
          <Card title="Profit & Loss">
            <DataTable
              columns={[
                { label: "Category", key: "category" },
                { label: "Amount (USD)", key: "amount", numeric: true },
                { label: "YoY Growth (%)", key: "growth", numeric: true },
              ]}
              rows={[
                { category: "Revenue", amount: 1200000, growth: -2.5 },
                { category: "Expenses", amount: 800000, growth: 3.0 },
                { category: "Profit", amount: 400000, growth: -5.5 },
              ]}
              stickyFirstColumn
            />
          </Card>
        </section>
      </main>
    </Page>
  );
}

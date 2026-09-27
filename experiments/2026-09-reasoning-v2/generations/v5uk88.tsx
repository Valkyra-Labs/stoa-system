import { Page, Header, Card, Metric, Delta, Trend, DataTable } from "@stoa/react";

export default function FinanceDashboard() {
  return (
    <Page title="Finance Dashboard">
      <Header title="Weekly Financial Summary" subtitle="As of 2023-11-06" />
      <main>
        <section>
          <Card title="Key Metrics">
            <Metric label="Revenue" value={1234567.89} delta={-100000} basis="Previous Week" unit="USD" />
            <Metric label="Expenses" value={987654.32} delta={50000} basis="Previous Week" unit="USD" />
            <Metric label="Net Profit" value={247913.57} delta={-150000} basis="Previous Week" unit="USD" />
          </Card>
        </section>
        <section>
          <Card title="Revenue Trends">
            <Trend series={[{ date: "2023-10-30", value: 1100000 }, { date: "2023-11-06", value: 1234567.89 }]} />
          </Card>
        </section>
        <section>
          <Card title="Expense Breakdown">
            <DataTable
              columns={[
                { label: "Category", key: "category" },
                { label: "Amount", key: "amount", unit: "USD" },
                { label: "Change", key: "change", unit: "%" },
              ]}
              rows={[
                { category: "Salaries", amount: 456789.12, change: -2 },
                { category: "Rent", amount: 123456.78, change: 0 },
                { category: "Utilities", amount: 23456.78, change: 5 },
              ]}
            />
          </Card>
        </section>
      </main>
    </Page>
  );
}

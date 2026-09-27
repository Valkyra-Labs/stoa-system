import { Page, Header, Card, Metric, Delta, Chart, DataTable, FilterBar, SavedViews } from "@stoa/react";

export default function FinanceOverview() {
  return (
    <Page title="Finance Overview">
      <Header title="Finance Overview" subtitle="Weekly Summary" actions={<SavedViews views={[]} />} />
      <main>
        <section>
          <Header title="Key Metrics" />
          <div style={{ display: "flex", gap: "20px", justifyContent: "space-around" }}>
            <Card title="Revenue">
              <Metric label="Total Revenue" value={123456789} unit="USD" />
              <Delta value={-123456} basis={123456789} />
            </Card>
            <Card title="Expenses">
              <Metric label="Total Expenses" value={87654321} unit="USD" />
              <Delta value={-456789} basis={87654321} />
            </Card>
            <Card title="Profit">
              <Metric label="Profit" value={35802468} unit="USD" />
              <Delta value={-777777} basis={35802468} />
            </Card>
          </div>
        </section>
        <section>
          <Header title="Financial Trends" />
          <Chart type="line" series={[{ name: "Revenue", data: [{ x: "2023-01-01", y: 100000000 }, { x: "2023-02-01", y: 120000000 }, { x: "2023-03-01", y: 110000000 }] }]} x="date" y="value" />
          <Chart type="line" series={[{ name: "Expenses", data: [{ x: "2023-01-01", y: 90000000 }, { x: "2023-02-01", y: 85000000 }, { x: "2023-03-01", y: 88000000 }] }]} x="date" y="value" />
        </section>
        <section>
          <Header title="Detailed Data" />
          <FilterBar filters={[{ id: "department", label: "Department", options: ["Sales", "Marketing", "Finance"] }, { id: "dateRange", label: "Date Range", options: ["Last Week", "Last Month", "Last Year"] }]} />
          <DataTable
            columns={[
              { name: "Department", id: "department" },
              { name: "Revenue", id: "revenue", unit: "USD" },
              { name: "Expenses", id: "expenses", unit: "USD" },
              { name: "Profit", id: "profit", unit: "USD" },
            ]}
            rows={[
              { department: "Sales", revenue: 60000000, expenses: 45000000, profit: 15000000 },
              { department: "Marketing", revenue: 40000000, expenses: 35000000, profit: 5000000 },
              { department: "Finance", revenue: 23456789, expenses: 21234567, profit: 2234567 },
            ]}
          />
        </section>
      </main>
    </Page>
  );
}

import { Page, Header, Section, Metric, Chart, DataTable } from "@stoa/react";

export default function FinanceOverview() {
  return (
    <Page title="Finance Overview">
      <Header title="Weekly Financial Summary" subtitle="Last 7 days" />
      <Section title="Key Metrics">
        <Metric label="Revenue" value={123456.78} unit="USD" />
        <Metric label="Expenses" value={98765.43} unit="USD" />
        <Metric label="Profit" value={24791.35} unit="USD" delta={{ value: 1234.56, basis: "previous week" }} />
      </Section>
      <Section title="Revenue by Source">
        <Chart type="bar" series={[
          { id: "sales", label: "Sales", data: [{ x: "Monday", y: 10000 }, { x: "Tuesday", y: 12000 }, { x: "Wednesday", y: 11500 }, { x: "Thursday", y: 13000 }, { x: "Friday", y: 14000 }, { x: "Saturday", y: 9000 }, { x: "Sunday", y: 8000 }] }
        ]} x="day" y="amount" />
      </Section>
      <Section title="Financial Transactions">
        <DataTable
          columns={[
            { id: "date", label: "Date", minWidth: 100 },
            { id: "description", label: "Description", minWidth: 200 },
            { id: "amount", label: "Amount", minWidth: 100, align: "right" },
            { id: "category", label: "Category", minWidth: 150 },
          ]}
          rows={[
            { id: 1, date: "2023-10-02", description: "Invoice 1234", amount: 1000, category: "Sales" },
            { id: 2, date: "2023-10-03", description: "Invoice 1235", amount: 1500, category: "Sales" },
            { id: 3, date: "2023-10-04", description: "Invoice 1236", amount: 1200, category: "Sales" },
            { id: 4, date: "2023-10-05", description: "Invoice 1237", amount: 1100, category: "Sales" },
            { id: 5, date: "2023-10-06", description: "Invoice 1238", amount: 1300, category: "Sales" },
            { id: 6, date: "2023-10-07", description: "Invoice 1239", amount: 1400, category: "Sales" },
            { id: 7, date: "2023-10-08", description: "Invoice 1240", amount: 900, category: "Sales" },
            { id: 8, date: "2023-10-09", description: "Invoice 1241", amount: 800, category: "Sales" },
          ]}
        />
      </Section>
    </Page>
  );
}

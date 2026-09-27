import { Page, Header, Section, Card, Chart, DataTable, Status } from "@stoa/react";

export default function WeeklyFinanceOverview() {
  return (
    <Page title="Weekly Finance Overview">
      <Header title="Finance Summary" subtitle="Week of March 6, 2023" />
      <Section title="Key Metrics">
        <Card title="Revenue">
          <Metric label="Total Revenue" value={1500000} delta={-10000} unit="USD" />
          <Trend series={[1400000, 1500000, 1510000, 1490000, 1480000]} />
        </Card>
        <Card title="Expenses">
          <Metric label="Total Expenses" value={1200000} delta={5000} unit="USD" />
          <Trend series={[1180000, 1190000, 1200000, 1210000, 1205000]} />
        </Card>
      </Section>
      <Section title="Financial Trends">
        <Chart type="line" series={[{ label: "Revenue", data: [1400000, 1500000, 1510000, 1490000, 1480000] }]} x="Week" y="Amount" />
        <Chart type="line" series={[{ label: "Expenses", data: [1180000, 1190000, 1200000, 1210000, 1205000] }]} x="Week" y="Amount" />
      </Section>
      <Section title="Recent Events">
        <DataTable
          columns={[
            { label: "Date", key: "date" },
            { label: "Event", key: "event" },
            { label: "Amount", key: "amount" },
          ]}
          rows={[
            { date: "2023-03-06", event: "New Contract Signed", amount: 100000 },
            { date: "2023-03-05", event: "Invoice Paid", amount: 50000 },
            { date: "2023-03-03", event: "Expense Claim Approved", amount: 20000 },
          ]}
        />
      </Section>
      <Section title="System Status">
        <Status tone="success" label="All Systems Operational" />
      </Section>
    </Page>
  );
}

import { Page, Header, Sidebar, Section, Card, Metric, Chart, Delta, Status } from "@stoa/react";

export default function WeeklyFinancialOverview() {
  return (
    <Page title="Weekly Financial Overview">
      <Header title="Weekly Financial Overview" subtitle="Monday Morning Snapshot" />
      <Sidebar>
        <p>Navigation Links</p>
      </Sidebar>
      <main>
        <Section title="Metrics">
          <Card title="Revenue">
            <Metric label="Revenue" value={123456} delta={-1234} unit="USD" />
            <Delta value={-1234} basis={123456} />
          </Card>
          <Card title="Expenses">
            <Metric label="Expenses" value={98765} delta={567} unit="USD" />
            <Delta value={567} basis={98765} />
          </Card>
        </Section>
        <Section title="Charts">
          <Card title="Revenue Trends">
            <Chart type="line" series={[{ label: "Revenue", data: [[1, 100000], [2, 110000], [3, 123456]] }]}>
              <Metric label="Revenue" value={123456} unit="USD" />
            </Chart>
          </Card>
          <Card title="Expense Breakdown">
            <Chart type="bar" series={[{ label: "Expenses", data: [[1, 90000], [2, 95000], [3, 98765]] }]}>
              <Metric label="Expenses" value={98765} unit="USD" />
            </Chart>
          </Card>
        </Section>
        <Section title="Exceptions">
          <Card title="Exceptions">
            <Status tone="warning" label="Pending Approval" />
            <Status tone="error" label="Over Budget" />
          </Card>
        </Section>
      </main>
    </Page>
  );
}

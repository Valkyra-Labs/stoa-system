import { Page, Header, Card, Metric, Delta, Chart, DataTable, Tabs, Section } from "@stoa/react";

const FinancialOverview = () => (
  <Page title="Financial Overview">
    <Header title="Weekly Financial Summary" subtitle="Monday, October 2, 2023" />
    <Section title="Company Metrics">
      <Card title="Revenue">
        <Metric label="Revenue" value={150000} delta={-5000} unit="USD" />
        <Delta value={-5000} basis={155000} />
        <Trend series={[150000, 155000, 152000, 151000, 150000]} />
      </Card>
      <Card title="Expenses">
        <Metric label="Expenses" value={100000} delta={2000} unit="USD" />
        <Delta value={2000} basis={98000} />
        <Trend series={[100000, 98000, 99000, 97000, 96000]} />
      </Card>
      <Card title="Profit">
        <Metric label="Profit" value={50000} delta={-7000} unit="USD" />
        <Delta value={-7000} basis={57000} />
        <Trend series={[50000, 57000, 53000, 54000, 50000]} />
      </Card>
    </Section>
    <Section title="Departmental Metrics">
      <Tabs items={[
        { id: "sales", label: "Sales", content: (
          <Card title="Sales Metrics">
            <Metric label="Revenue" value={60000} delta={-2000} unit="USD" />
            <Metric label="Expenses" value={30000} delta={1000} unit="USD" />
            <Metric label="Profit" value={30000} delta={-3000} unit="USD" />
            <Chart type="line" series={[60000, 62000, 60000, 58000, 60000]} x="Week" y="Revenue" />
          </Card>
        )},
        { id: "marketing", label: "Marketing", content: (
          <Card title="Marketing Metrics">
            <Metric label="Revenue" value={30000} delta={-1000} unit="USD" />
            <Metric label="Expenses" value={20000} delta={1000} unit="USD" />
            <Metric label="Profit" value={10000} delta={-2000} unit="USD" />
            <Chart type="line" series={[30000, 31000, 29000, 30000, 30000]} x="Week" y="Revenue" />
          </Card>
        )},
        { id: "operations", label: "Operations", content: (
          <Card title="Operations Metrics">
            <Metric label="Revenue" value={60000} delta={-2000} unit="USD" />
            <Metric label="Expenses" value={50000} delta={1000} unit="USD" />
            <Metric label="Profit" value={10000} delta={-3000} unit="USD" />
            <Chart type="line" series={[60000, 62000, 60000, 58000, 60000]} x="Week" y="Revenue" />
          </Card>
        )}
      ]} />
    </Section>
  </Page>
);

export default FinancialOverview;

import { Page, Header, Section, Card, Metric, Delta, Status, Button, EmptyData, Comparison } from "@stoa/react";

const weeklyData = [
  {
    id: "total",
    label: "Total Company",
    revenue: 1250000,
    expenses: 890000,
    net: 360000,
    budget: 400000,
    prevPeriod: 340000,
    trend: "up",
  },
  {
    id: "engineering",
    label: "Engineering",
    revenue: 0,
    expenses: 450000,
    net: -450000,
    budget: 500000,
    prevPeriod: -420000,
    trend: "down",
  },
  {
    id: "sales",
    label: "Sales & Marketing",
    revenue: 800000,
    expenses: 200000,
    net: 600000,
    budget: 650000,
    prevPeriod: 550000,
    trend: "up",
  },
  {
    id: "operations",
    label: "Operations",
    revenue: 450000,
    expenses: 240000,
    net: 210000,
    budget: 250000,
    prevPeriod: 200000,
    trend: "stable",
  },
];

export default function FinanceDashboard() {
  return (
    <Page title="Weekly Financial Overview">
      <Header title="Weekly Financial Review" subtitle="Mon, Oct 23" />

      <Section title="Executive Summary">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <Metric label="Net Income" value={360000} unit="$" />
          <Metric label="Burn Rate" value={450000} unit="$" />
          <Metric label="Cash Balance" value={12500000} unit="$" />
          <Metric label="Week-over-Week Change" value={20000} unit="$" />
        </div>
      </Section>

      <Section title="Department Performance vs Budget & Prior Period">
        <Card title="Financial Health by Unit">
          <Comparison
            entities={weeklyData}
            metrics={[
              { label: "Revenue", value: "revenue" },
              { label: "Expenses", value: "expenses" },
              { label: "Net Income", value: "net" },
              { label: "Budget Variance", value: "budget" },
              { label: "YoY Change", value: "prevPeriod" },
            ]}
          />
        </Card>
      </Section>

      <Section title="Action Items">
        <Card title="Requires Review">
          <div className="flex gap-4">
            <Status tone="warning" label="Engineering budget exceeded by $50k" />
            <Status tone="success" label="Sales ahead of schedule" />
          </div>
        </Card>
      </Section>

      <Section title="Quick Actions">
        <div className="flex gap-4">
          <Button label="Export PDF" variant="primary" />
          <Button label="Schedule Meeting" />
          <Button label="View Drill-down" />
        </div>
      </Section>
    </Page>
  );
}

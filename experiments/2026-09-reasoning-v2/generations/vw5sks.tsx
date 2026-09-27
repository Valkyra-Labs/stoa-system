import { Page, Header, Section, Card, Tabs, Metric, Delta, DataTable, EmptyData, Status, Button, BulkActions } from "@stoa/react";

const mockData = [
  { id: 1, category: "Revenue", metric: "QoQ Growth", value: 12.5, target: 10, previous: 8.2, unit: "%", status: "good" },
  { id: 2, category: "Revenue", metric: "QoQ Growth", value: -2.1, target: 5, previous: 3.5, unit: "%", status: "bad" },
  { id: 3, category: "Operating Expenses", metric: "QoQ Growth", value: 4.8, target: 2, previous: 1.5, unit: "%", status: "warning" },
  { id: 4, category: "Operating Expenses", metric: "Budget Variance", value: -120000, target: 0, previous: 50000, unit: "$", status: "warning" },
  { id: 5, category: "Cash Flow", metric: "QoQ Growth", value: 8.3, target: 6, previous: 4.1, unit: "%", status: "good" },
  { id: 6, category: "Cash Flow", metric: "Runway (Months)", value: 18, target: 24, previous: 20, unit: "mo", status: "bad" },
  { id: 7, category: "Revenue", metric: "YoY Growth", value: 15.2, target: 12, previous: 10, unit: "%", status: "good" },
];

export default function FinanceDashboard() {
  return (
    <Page title="Weekly Finance Overview">
      <Header title="Monday Morning Brief" subtitle="Pre-meeting variance analysis" actions={
        <Button label="Export Report" variant="secondary" />
      } />

      <Section title="Action Required: Exceptions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockData.filter(d => d.status === "bad").map(item => (
            <Card key={item.id} title={`Alert: ${item.category} - ${item.metric}`}>
              <div className="flex items-center justify-between">
                <Metric label="Current" value={item.value} unit={item.unit} />
                <Metric label="Target" value={item.target} unit={item.unit} />
              </div>
              <div className="mt-2">
                <Delta value={item.value - item.target} basis={item.target} unit={item.unit} />
              </div>
              <div className="mt-3 flex gap-2">
                <Button label="Review Details" onPress={() => {}} />
                <Button label="Approve Exception" variant="primary" onPress={() => {}} />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <Status tone="warning" label="Last updated: 08:15 AM" />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Full Performance Review">
        <DataTable 
          columns={[
            { key: "category", label: "Category", sticky: true },
            { key: "metric", label: "Metric" },
            { key: "value", label: "Actual", rightAlign: true },
            { key: "target", label: "Target", rightAlign: true },
            { key: "delta", label: "Vs Target", rightAlign: true },
          ]}
          rows={mockData}
          selectable
          bulkActions={[
            { label: "Flag for Audit", onPress: () => {} },
            { label: "Email Stakeholders", onPress: () => {} },
          ]}
          onRowSelect={() => {}}
        />
      </Section>

      <Section title="Trend Context">
        <Card title="Revenue Growth Trend (Last 4 Weeks)">
          <div className="h-40 flex items-end justify-between gap-2">
            {[12, 8, 15, 22].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${val}%` }} />
                <span className="text-xs text-gray-500">Wk {i+1}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Data source: ERP System (Refreshed 2h ago)
          </div>
        </Card>
      </Section>

      <Section title="Financial Health Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Liquidity">
            <Metric label="Cash Runway" value={18} unit="months" />
            <Metric label="Days Sales Outstanding" value={42} unit="days" />
          </Card>
          <Card title="Efficiency">
            <Metric label="EBITDA Margin" value={12.5} unit="%" />
            <Metric label="Asset Turnover" value={1.8} unit="" />
          </Card>
          <Card title="Compliance">
            <Metric label="Audit Findings" value={0} unit="open" />
            <Metric label="Tax Filing Status" value="On Time" unit="" />
          </Card>
        </div>
      </Section>
    </Page>
  );
}

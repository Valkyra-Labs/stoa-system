import { Page, Header, Sidebar, Section, Card, Metric, Delta, Trend, DataTable, Status, EmptyData, Button } from "@stoa/react";

export default function WeeklyFinanceDashboard() {
  const metrics = [
    { label: "Revenue", value: 1245000, delta: 12, unit: "USD" },
    { label: "Expenses", value: 890000, delta: -3, unit: "USD" },
    { label: "Net Profit", value: 355000, delta: 8, unit: "USD" },
  ];

  const rows = [
    { id: 1, segment: "Software Subscriptions", revenue: 450000, cost: 120000, margin: 73, status: "Healthy" },
    { id: 2, segment: "Professional Services", revenue: 380000, cost: 290000, margin: 24, status: "Watch" },
    { id: 3, segment: "Infrastructure", revenue: 150000, cost: 180000, margin: -20, status: "Critical" },
    { id: 4, segment: "Marketing", revenue: 215000, cost: 80000, margin: 63, status: "Healthy" },
    { id: 5, segment: "R&D", revenue: 50000, cost: 45000, margin: 10, status: "Healthy" },
  ];

  return (
    <Page title="Weekly Financial Performance">
      <Header title="Q3 2023 Weekly Review" subtitle="Week of October 23-29" />
      
      <Section title="Key Performance Indicators">
        <Card title="Financial Totals">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {metrics.map((m) => (
              <Metric key={m.label} label={m.label} value={m.value} delta={m.delta} unit={m.unit} />
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Revenue Stream Analysis">
        <Card title="Segment Performance vs. Targets">
          <DataTable
            columns={[
              { key: "id", label: "Segment" },
              { key: "revenue", label: "Revenue ($)" },
              { key: "cost", label: "Cost ($)" },
              { key: "margin", label: "Margin %" },
              { key: "status", label: "Status" },
            ]}
            rows={rows}
            onRowSelect={(id) => console.log(`Selected row ${id}`)}
          />
        </Card>
      </Section>

      <Section title="Outlier Detection & Alerts">
        <Card title="Critical Variance > 20%">
          <div>
            <Status tone="error" label="Infrastructure Cost Overrun" />
            <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              Actual: $180k | Expected: $140k | Variance: +28.6%
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <Status tone="warning" label="Professional Services Margin Compression" />
            <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              Actual Margin: 24% | Target: 35% | Impact: High
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Recent Audit Trail">
        <Card title="Significant Transactions (Last 24h)">
          <div>
            <p><strong>10:42 AM</strong> - Q3 Close confirmed by CFO. Total assets verified.</p>
            <p><strong>09:15 AM</strong> - Vendor payment processed for Cloud Infrastructure ($45k).</p>
            <p><strong>08:30 AM</strong> - Revenue recognition adjusted for SaaS tier upgrade.</p>
          </div>
        </Card>
      </Section>
    </Page>
  );
}

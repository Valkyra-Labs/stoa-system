import { Page, Header, Section, Card, Metric, Delta, Trend, Status, EmptyData } from "@stoa/react";

const WEEKLY_METRICS = [
  { label: "Revenue", value: 1245000, delta: 12.4, unit: "$", trend: [1100, 1150, 1180, 1210, 1245] },
  { label: "Operating Cost", value: 890000, delta: -5.2, unit: "$", trend: [950, 940, 920, 910, 890] },
  { label: "Net Profit", value: 355000, delta: 8.1, unit: "$", trend: [320, 330, 335, 340, 355] },
  { label: "Cash Flow", value: 410000, delta: 2.3, unit: "$", trend: [390, 395, 400, 405, 410] },
  { label: "Payroll", value: 520000, delta: 1.1, unit: "$", trend: [510, 512, 515, 518, 520] },
];

const ALERTS = [
  { label: "Marketing Spend", value: 150000, delta: 25, unit: "$", trend: [120, 125, 130, 135, 150], tone: "warning" },
  { label: "Cloud Services", value: 45000, delta: 15, unit: "$", trend: [40, 41, 42, 43, 45], tone: "info" },
];

export default function FinanceDashboard() {
  return (
    <Page title="Weekly Financial Overview">
      <Header title="Weekly Financial Report" subtitle="Week of Oct 23 - Oct 29" />
      
      <Section title="Key Performance Indicators">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {WEEKLY_METRICS.map((m) => (
            <Card key={m.label} title={m.label}>
              <Metric label="Current" value={m.value} unit={m.unit} />
              <Delta value={m.delta} basis="Wk" />
              <Trend series={m.trend} />
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Anomaly Detection & Alerts">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {ALERTS.map((alert) => (
            <Card key={alert.label} title={alert.label} style={{ border: alert.tone === "warning" ? "2px solid orange" : "1px solid #ccc" }}>
              <Metric label="Actual" value={alert.value} unit={alert.unit} />
              <Delta value={alert.delta} basis="Wk" />
              <Trend series={alert.trend} />
              <Status tone={alert.tone === "warning" ? "warning" : "neutral"} label={alert.tone === "warning" ? "Review Required" : "Monitor"} />
            </Card>
          ))}
        </div>
      </Section>
    </Page>
  );
}

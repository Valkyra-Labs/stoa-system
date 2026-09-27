import { Page, Header, Metric, Delta, Status, Section, Card, Tabs, Drawer, Button } from "@stoa/react";

export default function FinanceDashboard() {
  const metrics = [
    { label: "Revenue", value: 1245000, delta: 125000, unit: "USD", tone: "positive" },
    { label: "Expenses", value: 890000, delta: -45000, unit: "USD", tone: "negative" },
    { label: "Net Profit", value: 355000, delta: 170000, unit: "USD", tone: "positive" },
    { label: "EBITDA", value: 410000, delta: 50000, unit: "USD", tone: "positive" },
  ];

  const alerts = [
    { label: "Q3 Budget Variance", status: "warning", value: "12%" },
    { label: "Cash Flow Forecast", status: "info", value: "-3 days" },
  ];

  return (
    <Page title="Weekly Financial Overview">
      <Header title="Weekly Financial Overview" subtitle="Monday Morning Brief" />

      <Section title="Executive Summary">
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {metrics.map((m) => (
              <Metric key={m.label} label={m.label} value={m.value} delta={m.delta} unit={m.unit} />
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Critical Alerts">
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {alerts.map((a) => (
              <div key={a.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Status tone={a.status} label={a.status} />
                <div>
                  <p>{a.label}</p>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>{a.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Detailed Line Items">
        <Card title="Expense Breakdown">
          <Tabs items={[]}>
            {items => (
              <div style={{ padding: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  {["Office Rent", "Salaries", "Utilities", "Software", "Travel"].map((item, idx) => (
                    <div key={item} style={{ border: "1px solid #eee", padding: "0.5rem", borderRadius: "4px" }}>
                      <p style={{ margin: 0, fontSize: "0.9rem" }}>{item}</p>
                      <p style={{ margin: "0.5rem 0 0", fontSize: "1.2rem", fontWeight: "bold" }}>
                        ${(100 + idx * 20000).toLocaleString()}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                        vs. last week: {idx % 2 === 0 ? "+2%" : "-1%"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Tabs>
        </Card>
      </Section>

      <Section title="Actions">
        <Card>
          <Button label="Download Report" variant="primary" onPress={() => alert("Report downloaded")} />
          <Button label="View Board Meeting Notes" variant="secondary" onPress={() => alert("Navigating to notes")} />
        </Card>
      </Section>
    </Page>
  );
}

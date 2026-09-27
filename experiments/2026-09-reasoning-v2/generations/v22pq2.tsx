import { Page, Header, Section, Card, Metric, Delta, DataTable, Status, Button } from "@stoa/react";

export default function FinanceDashboard() {
  const metrics = [
    { label: "Revenue", value: 1245000, delta: 5.2, unit: "USD" },
    { label: "OpEx", value: 432000, delta: -1.8, unit: "USD" },
    { label: "Net Profit", value: 813000, delta: 3.4, unit: "USD" },
    { label: "Cash Flow", value: 210000, delta: 12.1, unit: "USD" },
  ];

  const budgetMetrics = [
    { label: "Revenue", actual: 1245000, budget: 1200000, delta: 3.75 },
    { label: "OpEx", actual: 432000, budget: 450000, delta: -3.78 },
    { label: "Net Profit", actual: 813000, budget: 750000, delta: 8.4 },
  ];

  const transactions = [
    { id: 101, entity: "Tech Solutions Inc.", amount: -125000, date: "2023-10-24", category: "Software", status: "Paid" },
    { id: 102, entity: "Global Supplies Co.", amount: -45000, date: "2023-10-23", category: "Office", status: "Pending" },
    { id: 103, entity: "Client Alpha", amount: 150000, date: "2023-10-23", category: "Revenue", status: "Collected" },
    { id: 104, entity: "HR Consulting", amount: -8500, date: "2023-10-22", category: "Salaries", status: "Paid" },
    { id: 105, entity: "Cloud Services", amount: -12000, date: "2023-10-22", category: "Infrastructure", status: "Paid" },
  ];

  return (
    <Page title="Weekly Financial Overview">
      <Header title="Finance Dashboard" subtitle="Monday Briefing" />

      <Section title="Key Performance Indicators">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {metrics.map((m) => (
            <Card key={m.label} title={m.label}>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
                ${m.value.toLocaleString()}
              </div>
              <Delta value={m.delta} basis="%" />
              <div style={{ fontSize: "12px", color: "#666" }}>{m.unit}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Budget vs. Actual Performance">
        <Card title="Monthly Variance">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div>
              <Metric label="Revenue" value={budgetMetrics[0].actual} delta={budgetMetrics[0].delta} />
              <Metric label="OpEx" value={budgetMetrics[1].actual} delta={budgetMetrics[1].delta} />
              <Metric label="Net Profit" value={budgetMetrics[2].actual} delta={budgetMetrics[2].delta} />
            </div>
            <div>
              <p>Budgeted Targets (Previous Month)</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
                {budgetMetrics.map((m) => (
                  <div key={m.label} style={{ fontSize: "14px" }}>
                    <strong>{m.label}</strong>: <span style={{ color: m.delta > 0 ? "green" : "red" }}>
                      {m.delta > 0 ? "+" : ""}{m.delta}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Recent Transactions & Cash Flow">
        <DataTable
          columns={[
            { key: "entity", label: "Entity", width: "30%" },
            { key: "category", label: "Category", width: "15%" },
            { key: "amount", label: "Amount", width: "20%", align: "right" },
            { key: "date", label: "Date", width: "20%" },
            { key: "status", label: "Status", width: "15%" },
          ]}
          rows={transactions}
          onRowSelect={(row) => {
            // Placeholder for detail view logic
            console.log("Selected:", row);
          }}
        />
      </Section>

      <Section title="Action Items">
        <Card title="Urgent Follow-ups">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Payment Dispute</strong>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Tech Solutions Inc. invoice #9921 is flagged for review.
                </div>
              </div>
              <Status tone="warning" label="Review Required" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Forecast Update</strong>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Q4 projections need adjustment based on current cash flow.
                </div>
              </div>
              <Status tone="neutral" label="Pending" />
            </div>
          </div>
          <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            <Button label="View Details" variant="primary" onPress={() => {}} />
            <Button label="Export Report" variant="secondary" onPress={() => {}} />
          </div>
        </Card>
      </Section>
    </Page>
  );
}

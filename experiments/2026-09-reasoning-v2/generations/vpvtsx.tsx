import { Page, Header, Sidebar, Section, Card, Tabs, Metric, DataTable, Status, EmptyData, Button } from "@stoa/react";

// Placeholder data
const summaryMetrics = [
  { label: "Revenue", value: "$1.2M", delta: 8.2, unit: "vs last week" },
  { label: "Expenses", value: "$450K", delta: -2.1, unit: "vs last week" },
  { label: "Net Profit", value: "$750K", delta: 5.4, unit: "vs last week" },
  { label: "Cash Flow", value: "$200K", delta: 12.0, unit: "vs last week" },
];

const recentTransactions = [
  { id: 1, description: "Q3 Client Invoice", amount: 120000, status: "Paid", date: "2023-10-23" },
  { id: 2, description: "Software License Renewal", amount: 5000, status: "Pending", date: "2023-10-22" },
  { id: 3, description: "Office Supplies", amount: 2500, status: "Paid", date: "2023-10-21" },
  { id: 4, description: "Marketing Campaign Q4", amount: 80000, status: "Approved", date: "2023-10-20" },
  { id: 5, description: "Server Maintenance", amount: 15000, status: "Pending", date: "2023-10-19" },
];

const financialTrend = [
  { label: "Week 43", value: 1100 },
  { label: "Week 42", value: 1050 },
  { label: "Week 41", value: 1080 },
  { label: "Week 40", value: 1120 },
  { label: "Week 39", value: 1000 },
];

export default function FinanceDashboard() {
  return (
    <Page title="Weekly Financial Review">
      <Header title="Weekly Financial Review" subtitle="October 23, 2023" />
      
      <main>
        <Section title="Executive Summary">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {summaryMetrics.map((m) => (
              <Card key={m.label} title={m.label}>
                <Metric value={m.value} delta={m.delta} unit={m.unit} />
              </Card>
            ))}
          </div>

          <Card title="Cash Flow Trend (Last 5 Weeks)">
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
              {/* Placeholder for a Chart component */}
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                [Chart: Revenue Trend]
              </div>
            </div>
          </Card>
        </Section>

        <Section title="Recent Transactions">
          <Card title="Activity Log">
            <DataTable 
              columns={[
                { key: "description", label: "Description" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
              ]}
              rows={recentTransactions}
              selectable
            />
          </Card>
        </Section>

        <Section title="Audit Log">
          <Card title="Recent Entries">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentTransactions.slice(0, 3).map((t, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  <div>
                    <Status tone="neutral" label={t.status} />
                    <span style={{ marginLeft: "8px", color: "#666" }}>{t.date}</span>
                  </div>
                  <div style={{ fontWeight: "bold" }}>{t.amount}</div>
                </div>
              ))}
              <EmptyData message="No more entries to display." />
            </div>
          </Card>
        </Section>
      </main>
    </Page>
  );
}

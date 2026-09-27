import { Page, Header, Section, Card, Metric, DataTable, Status, EmptyData, Button } from "@stoa/react";

const WeeklyFinancialReport = () => {
  const metrics = [
    { label: "Revenue", value: 1245000, delta: 12.5, unit: "$" },
    { label: "Operating Expenses", value: 890000, delta: -2.1, unit: "$" },
    { label: "EBITDA", value: 355000, delta: 8.3, unit: "$" },
    { label: "Cash Flow", value: 110000, delta: 5.2, unit: "$" },
  ];

  const previousWeekMetrics = [
    { label: "Revenue", value: 1107000, unit: "$" },
    { label: "Operating Expenses", value: 909180, unit: "$" },
    { label: "EBITDA", value: 326820, unit: "$" },
    { label: "Cash Flow", value: 104600, unit: "$" },
  ];

  const budgetMetrics = [
    { label: "Revenue", value: 1300000, unit: "$" },
    { label: "Operating Expenses", value: 950000, unit: "$" },
    { label: "EBITDA", value: 350000, unit: "$" },
    { label: "Cash Flow", value: 120000, unit: "$" },
  ];

  const tableData = [
    { id: "INV-2023-001", date: "2023-10-23", amount: 125000, status: "Paid", category: "Sales" },
    { id: "INV-2023-002", date: "2023-10-24", amount: 89000, status: "Pending", category: "Services" },
    { id: "INV-2023-003", date: "2023-10-25", amount: 45000, status: "Paid", category: "Sales" },
    { id: "INV-2023-004", date: "2023-10-26", amount: 210000, status: "Pending", category: "Licensing" },
    { id: "INV-2023-005", date: "2023-10-27", amount: 12000, status: "Paid", category: "Support" },
  ];

  const statusMap = {
    Paid: { tone: "success", label: "Paid" },
    Pending: { tone: "warning", label: "Pending" },
    Overdue: { tone: "error", label: "Overdue" },
  };

  return (
    <Page title="Weekly Financial Report">
      <Header title="Weekly Performance" subtitle="October 23, 2023" />
      
      <Section title="Key Performance Indicators">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {metrics.map((metric) => (
            <Card key={metric.label} title={metric.label}>
              <Metric label="Value" value={metric.value} delta={metric.delta} unit={metric.unit} />
              <div style={{ marginTop: "8px", fontSize: "0.9em", color: "text.secondary" }}>
                {metric.delta > 0 ? "▲" : "▼"} {Math.abs(metric.delta)}% vs last week
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Budget vs Actuals">
        <Card title="Financial Summary">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            {metrics.map((metric) => (
              <div key={metric.label} style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ fontSize: "0.9em", marginBottom: "4px", color: "text.secondary" }}>
                  Budget: {budgetMetrics.find((m) => m.label === metric.label)?.value.toLocaleString()}
                </div>
                <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                  Actual: {metric.value.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.8em", color: metric.delta >= 0 ? "text.success" : "text.error" }}>
                  {metric.delta >= 0 ? "On track" : "Over budget"}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Transaction Details">
        <Card title="Recent Transactions">
          <DataTable
            columns={[
              { key: "id", label: "Invoice ID" },
              { key: "date", label: "Date" },
              { key: "amount", label: "Amount", type: "currency" },
              { key: "status", label: "Status" },
              { key: "category", label: "Category" },
            ]}
            rows={tableData}
            selectable
            stickyFirstColumn
          />
        </Card>
      </Section>

      <Section title="Action Required">
        <Card title="Pending Review">
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", background: "warning.light", borderRadius: "4px" }}>
              <Status tone="warning" label="Pending Approval" />
              <span style={{ fontSize: "1.1em" }}>
                Two invoices require manager approval before payment processing.
              </span>
            </div>
            <Button label="Approve Pending Items" onPress={() => alert("Approval requested")} variant="primary" />
            <Button label="View Full Details" onPress={() => alert("Navigating to details")} variant="secondary" />
          </div>
        </Card>
      </Section>
    </Page>
  );
};

export default WeeklyFinancialReport;

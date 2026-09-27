import {
  Page,
  Header,
  Section,
  Card,
  Tabs,
  Metric,
  DataTable,
  BulkActions,
  Status,
  Button,
  EmptyData,
  FilterBar,
  SavedViews,
} from "@stoa/react";

const PAGE_TITLE = "Failed Payouts Resolution";

function FailedPayoutsScreen() {
  const views = [
    { id: "all", label: "All Failures" },
    { id: "critical", label: "Critical Errors" },
    { id: "recent", label: "Last 24 Hours" },
  ];

  const filters = {
    reason: ["Card Declined", "Insufficient Funds", "Bank Rejected", "Timeout"],
    status: ["Pending", "Retry", "Refunded"],
    amount: { min: 0, max: 5000 },
  };

  const rows = [
    {
      id: "TXN-9821",
      amount: 1250.00,
      currency: "USD",
      customer: "Alice M.",
      customerEmail: "alice@example.com",
      reason: "Card Declined",
      status: "Pending",
      timestamp: "2023-10-24T14:30:00Z",
      retryAttempts: 0,
    },
    {
      id: "TXN-9822",
      amount: 850.50,
      currency: "USD",
      customer: "Bob S.",
      customerEmail: "bob@example.com",
      reason: "Insufficient Funds",
      status: "Retry",
      timestamp: "2023-10-24T13:15:00Z",
      retryAttempts: 2,
    },
    {
      id: "TXN-9823",
      amount: 3200.00,
      currency: "EUR",
      customer: "Charlie D.",
      customerEmail: "charlie@example.com",
      reason: "Bank Rejected",
      status: "Pending",
      timestamp: "2023-10-24T11:45:00Z",
      retryAttempts: 0,
    },
    {
      id: "TXN-9824",
      amount: 150.00,
      currency: "USD",
      customer: "Diana P.",
      customerEmail: "diana@example.com",
      reason: "Card Declined",
      status: "Refunded",
      timestamp: "2023-10-24T09:20:00Z",
      retryAttempts: 3,
    },
    {
      id: "TXN-9825",
      amount: 2100.75,
      currency: "GBP",
      customer: "Evan R.",
      customerEmail: "evan@example.com",
      reason: "Timeout",
      status: "Pending",
      timestamp: "2023-10-24T08:10:00Z",
      retryAttempts: 0,
    },
  ];

  const metrics = [
    { label: "Total Failed", value: 142, unit: "payouts" },
    { label: "Critical Errors", value: 18, unit: "items" },
    { label: "Avg. Retry Attempts", value: 1.2, unit: "times" },
  ];

  const handleRowSelect = (rowId: string) => {
    console.log("Selected row:", rowId);
  };

  return (
    <Page title={PAGE_TITLE}>
      <Header
        title={PAGE_TITLE}
        subtitle="Triage and resolve failed payment transactions"
        actions={
          <>
            <Button label="Export Report" variant="secondary" />
            <Button label="Clear All Queue" onPress={() => console.log("Cleared")} />
          </>
        }
      />

      <Section title="Summary">
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {metrics.map((metric) => (
            <Metric key={metric.label} {...metric} />
          ))}
        </div>
      </Section>

      <Section title="Failed Payouts Queue">
        <Card>
          <SavedViews views={views} />

          <FilterBar filters={filters} />

          <DataTable
            columns={[
              { key: "id", label: "Transaction ID" },
              { key: "amount", label: "Amount" },
              { key: "currency", label: "Currency" },
              { key: "customer", label: "Customer" },
              { key: "reason", label: "Failure Reason" },
              { key: "status", label: "Status" },
              { key: "timestamp", label: "Time" },
            ]}
            rows={rows}
            selectable
            stickyFirstColumn
            onRowSelect={handleRowSelect}
          />

          {rows.length === 0 && (
            <EmptyData
              message="No failed payouts found matching your filters."
              action={<Button label="Clear Filters" />}
            />
          )}

          <BulkActions
            actions={[
              { label: "Retry All", icon: "refresh", variant: "primary" },
              { label: "Force Refund", icon: "refund", variant: "danger" },
              { label: "Mark as Handled", icon: "check", variant: "success" },
            ]}
          />
        </Card>
      </Section>
    </Page>
  );
}

export default FailedPayoutsScreen;

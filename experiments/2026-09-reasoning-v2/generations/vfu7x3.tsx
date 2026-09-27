import { Page, Header, Section, Card, Button, Status, EmptyData, StaleData, ErrorData, Metric, Delta, DataTable, FilterBar, BulkActions, Timeline } from "@stoa/react";

export default function FailedPayoutsPage() {
  const filters = {
    merchant: "All",
    status: "Pending",
    amount: "All",
  };

  const savedViews = [
    { id: "last-24h", name: "Last 24h" },
    { id: "high-value", name: "High Value" },
  ];

  const data = [
    { id: "txn-101", merchant: "Acme Corp", amount: 5000, currency: "USD", status: "Pending", reason: "Card declined", date: "2023-10-24T10:00:00Z", retryCount: 0, customerEmail: "ops@acme.com" },
    { id: "txn-102", merchant: "Globex Inc", amount: 2500, currency: "USD", status: "Pending", reason: "Insufficient funds", date: "2023-10-24T09:30:00Z", retryCount: 1, customerEmail: "pay@globex.com" },
    { id: "txn-103", merchant: "Stark Ind", amount: 12000, currency: "USD", status: "Pending", reason: "Fraud flag", date: "2023-10-24T08:15:00Z", retryCount: 0, customerEmail: "billing@stark.com" },
    { id: "txn-104", merchant: "Wayne Ent", amount: 800, currency: "USD", status: "Pending", reason: "Bank timeout", date: "2023-10-24T07:45:00Z", retryCount: 2, customerEmail: "finance@wayne.com" },
    { id: "txn-105", merchant: "Acme Corp", amount: 3200, currency: "USD", status: "Pending", reason: "Card declined", date: "2023-10-23T18:20:00Z", retryCount: 0, customerEmail: "ops@acme.com" },
    { id: "txn-106", merchant: "Cyberdyne", amount: 45000, currency: "USD", status: "Pending", reason: "Compliance hold", date: "2023-10-23T16:00:00Z", retryCount: 0, customerEmail: "legal@cyberdyne.com" },
  ];

  const history = [
    { id: "evt-1", time: "2023-10-24T10:00:00Z", action: "Payout initiated", details: "Requested by user admin@acme.com" },
    { id: "evt-2", time: "2023-10-24T10:05:00Z", action: "Gateway response: Declined", details: "Code: InsufficientFunds" },
  ];

  const actions = [
    { id: "retry", label: "Retry", variant: "primary", description: "Resubmit transaction" },
    { id: "escalate", label: "Escalate", variant: "secondary", description: "Forward to support team" },
    { id: "cancel", label: "Cancel", variant: "danger", description: "Void the transaction" },
  ];

  return (
    <Page title="Failed Payouts Resolution">
      <Header
        title="Failed Payouts"
        subtitle="Work queue for resolving failed transactions"
        actions={
          <div className="flex gap-2">
            <Button label="Export Report" variant="secondary" />
            <Button label="Refresh Data" onPress={() => {}} />
          </div>
        }
      />

      <Section title="Summary">
        <Card title="Queue Status">
          <div className="flex flex-wrap gap-4">
            <Metric label="Total Pending" value={data.length} />
            <Metric label="High Value (> $10k)" value={1} />
            <Metric label="Retry Attempts" value={2} />
            <Delta value={-4} basis="previous period" />
          </div>
          <Status tone="warning" label="Last updated 2 minutes ago" />
        </Card>
      </Section>

      <Section title="Resolution Queue">
        <FilterBar filters={filters} savedViews={savedViews} />
        <DataTable
          columns={[
            { key: "id", label: "ID", sticky: true },
            { key: "merchant", label: "Merchant" },
            { key: "amount", label: "Amount" },
            { key: "reason", label: "Reason" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
          ]}
          rows={data}
          selectable
          bulkActions={actions}
        />
      </Section>

      <Section title="Evidence & History">
        <Card title="Detailed View">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3>Transaction Details</h3>
              <Metric label="Customer Email" value={data[0].customerEmail} />
              <Metric label="Retry Count" value={data[0].retryCount} />
              <Timeline events={history} />
            </div>
            <div>
              <h3>Available Actions</h3>
              <div className="flex flex-col gap-2">
                {actions.map((action) => (
                  <Button
                    key={action.id}
                    label={action.label}
                    onPress={() => {}}
                    variant={action.variant}
                  >
                    {action.description}
                  </Button>
                ))}
              </div>
              <Status tone="info" label="Actions confirmed" />
            </div>
          </div>
        </Card>
      </Section>
    </Page>
  );
}

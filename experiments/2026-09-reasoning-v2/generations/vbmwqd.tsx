import { Page, Header, Sidebar, Section, Card, Tabs, Button, DataTable, Metric, Status, EmptyData } from "@stoa/react";

const failedPayouts = [
  { id: "P-1001", recipient: "John Doe", amount: 500.00, currency: "USD", reason: "Insufficient funds", status: "failed", timestamp: "2023-10-01T10:00:00Z" },
  { id: "P-1002", recipient: "Jane Smith", amount: 1200.50, currency: "USD", reason: "Card declined", status: "failed", timestamp: "2023-10-01T11:30:00Z" },
  { id: "P-1003", recipient: "Acme Corp", amount: 5000.00, currency: "USD", reason: "Bank timeout", status: "failed", timestamp: "2023-10-01T12:15:00Z" },
  { id: "P-1004", recipient: "Bob Wilson", amount: 75.25, currency: "USD", reason: "Invalid account number", status: "failed", timestamp: "2023-10-01T13:45:00Z" },
  { id: "P-1005", recipient: "Tech Inc", amount: 25000.00, currency: "USD", reason: "Fraud alert", status: "failed", timestamp: "2023-10-01T14:20:00Z" },
  { id: "P-1006", recipient: "Alice Brown", amount: 300.00, currency: "USD", reason: "Card declined", status: "failed", timestamp: "2023-10-01T15:00:00Z" },
  { id: "P-1007", recipient: "Global Ltd", amount: 15000.00, currency: "USD", reason: "Bank timeout", status: "failed", timestamp: "2023-10-01T16:10:00Z" },
  { id: "P-1008", recipient: "Charlie Davis", amount: 99.99, currency: "USD", reason: "Insufficient funds", status: "failed", timestamp: "2023-10-01T17:05:00Z" },
  { id: "P-1009", recipient: "Delta Systems", amount: 8000.00, currency: "USD", reason: "Invalid account number", status: "failed", timestamp: "2023-10-01T18:30:00Z" },
  { id: "P-1010", recipient: "Eva Green", amount: 450.00, currency: "USD", reason: "Fraud alert", status: "failed", timestamp: "2023-10-01T19:45:00Z" },
];

const failureReasons = [
  { id: "insufficient_funds", label: "Insufficient funds", count: 2, color: "yellow" },
  { id: "card_declined", label: "Card declined", count: 2, color: "orange" },
  { id: "bank_timeout", label: "Bank timeout", count: 2, color: "blue" },
  { id: "invalid_account", label: "Invalid account number", count: 2, color: "gray" },
  { id: "fraud_alert", label: "Fraud alert", count: 2, color: "red" },
];

const resolveActions = [
  { label: "Retry", action: "retry", variant: "primary" },
  { label: "Issue Refund", action: "refund", variant: "secondary" },
  { label: "Manual Override", action: "override", variant: "outline" },
  { label: "Archive", action: "archive", variant: "ghost" },
];

const DetailPanel = ({ payout, onClose }: { payout: typeof failedPayouts[0]; onClose: () => void }) => {
  return (
    <aside className="detail-panel">
      <h3>Payout Details</h3>
      <Metric label="ID" value={payout.id} />
      <Metric label="Recipient" value={payout.recipient} />
      <Metric label="Amount" value={`${payout.amount.toFixed(2)} ${payout.currency}`} />
      <Metric label="Status" value={payout.status} />
      <Metric label="Failed At" value={payout.timestamp} />
      <Section title="Failure Reason">
        <p>{payout.reason}</p>
      </Section>
      <Section title="Actions">
        {resolveActions.map((action) => (
          <Button key={action.action} label={action.label} onPress={() => alert(`Executing ${action.label} for ${payout.id}`)} variant={action.variant} />
        ))}
        <Button label="Close" onPress={onClose} variant="ghost" />
      </Section>
    </aside>
  );
};

export default function FailedPayoutsScreen() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [selectedPayout] = React.useState(() => {
    const id = selectedId || failedPayouts[0].id;
    return failedPayouts.find((p) => p.id === id) || failedPayouts[0];
  });

  return (
    <Page title="Failed Payouts Resolution">
      <Header title="Failed Payouts" subtitle="Manage and resolve transaction failures" />
      <Section title="Resolution Queue">
        <Card title="Failed Transactions" className="table-container">
          <DataTable
            columns={[
              { key: "id", label: "ID" },
              { key: "recipient", label: "Recipient" },
              { key: "amount", label: "Amount", type: "currency" },
              { key: "reason", label: "Reason" },
              { key: "timestamp", label: "Time" },
            ]}
            rows={failedPayouts}
            onRowSelect={(row) => setSelectedId(row.id)}
            selectable
          />
        </Card>
        <Section title="Failure Breakdown">
          <div className="metrics-grid">
            {failureReasons.map((reason) => (
              <Card key={reason.id} title={reason.label}>
                <Metric label="Count" value={reason.count} unit="transactions" />
              </Card>
            ))}
          </div>
        </Section>
      </Section>
      <Section title="Resolution Actions" className="actions-section">
        <div className="action-buttons">
          {resolveActions.map((action) => (
            <Button key={action.action} label={action.label} onPress={() => alert(`Executing ${action.label}`)} variant={action.variant} />
          ))}
        </div>
      </Section>
      {selectedPayout && (
        <Drawer title={`Details: ${selectedPayout.id}`} open={true} className="detail-drawer">
          <DetailPanel payout={selectedPayout} onClose={() => setSelectedId(null)} />
        </Drawer>
      )}
    </Page>
  );
}

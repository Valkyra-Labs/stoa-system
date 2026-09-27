import { Page, Header, Section, Card, DataTable, Button, FilterBar, BulkActions, EmptyData, Metric, Delta, Status, Tabs, Drawer, Metric, Delta, Status, EmptyData, PartialData, StaleData, ErrorData } from "@stoa/react";

const failedPayouts = [
  {
    id: "P-12345",
    amount: 500,
    currency: "USD",
    status: "failed",
    reason: "insufficient_funds",
    createdAt: "2023-10-05T14:30:00Z",
    lastAttemptedAt: "2023-10-05T15:20:00Z",
    recipient: "john.doe@example.com",
    transactionId: "TXN-789012",
    notes: "Customer reported insufficient funds, but balance seems sufficient.",
  },
  {
    id: "P-67890",
    amount: 200,
    currency: "USD",
    status: "failed",
    reason: "invalid_recipient",
    createdAt: "2023-10-05T10:15:00Z",
    lastAttemptedAt: "2023-10-05T10:30:00Z",
    recipient: "jane.smith@example.com",
    transactionId: "TXN-345678",
    notes: "Recipient email invalid. Contacted customer for confirmation.",
  },
  {
    id: "P-11223",
    amount: 150,
    currency: "USD",
    status: "failed",
    reason: "processing_error",
    createdAt: "2023-10-05T09:45:00Z",
    lastAttemptedAt: "2023-10-05T10:00:00Z",
    recipient: "mark.jones@example.com",
    transactionId: "TXN-901234",
    notes: "System error during processing. Retrying now.",
  },
];

const failedPayoutsColumns = [
  { key: "id", label: "ID" },
  { key: "amount", label: "Amount", format: (v) => `$${v}` },
  { key: "currency", label: "Currency" },
  { key: "status", label: "Status", format: (v) => <Status tone={v === "failed" ? "error" : "warning"} label={v} /> },
  { key: "reason", label: "Reason" },
  { key: "createdAt", label: "Created At" },
  { key: "recipient", label: "Recipient" },
  { key: "transactionId", label: "Transaction ID" },
  { key: "notes", label: "Notes" },
];

const FailedPayoutsPage = () => {
  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="Review and resolve failed transactions" actions={<Button label="Retry All" variant="primary" />} />
      <FilterBar filters={[]} />
      <Section title="Failed Payouts">
        <DataTable
          columns={failedPayoutsColumns}
          rows={failedPayouts}
          selectable
          stickyFirstColumn
          onRowSelect={(selected) => console.log("Selected:", selected)}
        />
        <BulkActions>
          <Button label="Retry Selected" variant="secondary" />
          <Button label="Contact Support" variant="secondary" />
          <Button label="Delete" variant="danger" />
        </BulkActions>
      </Section>
      <Section title="Key Metrics">
        <Card>
          <Metric label="Total Failed Payouts" value={failedPayouts.length} unit="payouts" />
          <Metric label="Total Amount Failed" value={failedPayouts.reduce((sum, p) => sum + p.amount, 0)} unit="USD" />
          <Metric label="Average Failed Amount" value={failedPayouts.length > 0 ? failedPayouts.reduce((sum, p) => sum + p.amount, 0) / failedPayouts.length : 0} unit="USD" />
        </Card>
      </Section>
    </Page>
  );
};

export default FailedPayoutsPage;

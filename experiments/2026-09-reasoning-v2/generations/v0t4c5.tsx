import { Page, Header, Sidebar, Section, Card, DataTable, Metric, Status, Button, EmptyData } from "@stoa/react";

const PAGE_TITLE = "Failed Payouts Resolution";

const placeholderData = [
  { id: "TX-8821", customer: "Alice M.", amount: 1250.00, reason: "INSUFFICIENT_FUNDS", timestamp: "2023-10-24T14:30:00Z", retryable: true, logs: 3 },
  { id: "TX-8822", customer: "Bob K.", amount: 450.50, reason: "BANK_TIMEOUT", timestamp: "2023-10-24T14:32:00Z", retryable: true, logs: 1 },
  { id: "TX-8823", customer: "Carol D.", amount: 8900.00, reason: "VALIDATION_ERROR", timestamp: "2023-10-24T14:35:00Z", retryable: true, logs: 5 },
  { id: "TX-8824", customer: "Dave R.", amount: 320.00, reason: "ACCOUNT_CLOSED", timestamp: "2023-10-24T14:38:00Z", retryable: false, logs: 2 },
  { id: "TX-8825", customer: "Eve L.", amount: 120.00, reason: "NETWORK_ERROR", timestamp: "2023-10-24T14:40:00Z", retryable: true, logs: 1 },
  { id: "TX-8826", customer: "Frank S.", amount: 5500.00, reason: "INSUFFICIENT_FUNDS", timestamp: "2023-10-24T14:42:00Z", retryable: false, logs: 4 },
  { id: "TX-8827", customer: "Grace W.", amount: 210.75, reason: "BANK_TIMEOUT", timestamp: "2023-10-24T14:45:00Z", retryable: true, logs: 2 },
  { id: "TX-8828", customer: "Henry P.", amount: 9999.00, reason: "DUPLICATE_TX", timestamp: "2023-10-24T14:48:00Z", retryable: false, logs: 6 },
  { id: "TX-8829", customer: "Ivy B.", amount: 450.00, reason: "INVALID_CURRENCY", timestamp: "2023-10-24T14:50:00Z", retryable: false, logs: 1 },
  { id: "TX-8830", customer: "Jack T.", amount: 750.00, reason: "INSUFFICIENT_FUNDS", timestamp: "2023-10-24T14:52:00Z", retryable: true, logs: 3 },
];

const columns = [
  { key: "id", label: "Transaction ID" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "reason", label: "Reason" },
  { key: "timestamp", label: "Time" },
  { key: "retryable", label: "Retryable", render: (v: boolean) => v ? "Yes" : "No" },
];

const reasonMap: Record<string, string> = {
  INSUFFICIENT_FUNDS: "Insufficient Funds",
  BANK_TIMEOUT: "Bank Timeout",
  VALIDATION_ERROR: "Validation Error",
  ACCOUNT_CLOSED: "Account Closed",
  NETWORK_ERROR: "Network Error",
  DUPLICATE_TX: "Duplicate Transaction",
  INVALID_CURRENCY: "Invalid Currency",
};

export default function FailedPayoutsScreen() {
  return (
    <Page title={PAGE_TITLE}>
      <Header title={PAGE_TITLE} subtitle="Resolve failed payout transactions" />

      <Section title="Queue Overview">
        <Card>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Metric label="Pending Resolution" value={placeholderData.length} />
            <Metric label="Retryable" value={placeholderData.filter((r) => r.retryable).length} />
            <Metric label="Escalations Needed" value={placeholderData.filter((r) => !r.retryable).length} />
          </div>
        </Card>
      </Section>

      <Section title="Failed Transactions">
        <Card>
          <DataTable
            columns={columns}
            rows={placeholderData}
            selectable
            onRowSelect={(row) => {
              // Simulate opening a detail view or modal for the selected row
              console.log("Selected for detail:", row);
            }}
          />
        </Card>
      </Section>

      <Section title="Resolution Actions">
        <Card>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button label="Retry All" onPress={() => console.log("Retrying all...")} />
            <Button label="Mark Permanent Failure" variant="danger" onPress={() => console.log("Marking permanent...")} />
            <Button label="Bulk Escalate" onPress={() => console.log("Escalating...")} />
            <Button label="Clear Queue" onPress={() => console.log("Clearing queue...")} />
          </div>
        </Card>
      </Section>
    </Page>
  );
}

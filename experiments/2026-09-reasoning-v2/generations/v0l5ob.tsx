import { Page, Header, Section, Card, DataTable, Button, FilterBar, Tabs, Status } from "@stoa/react";

const failedPayouts = [
  {
    id: "P-1001",
    amount: "$50.00",
    error: "PaymentProcessorError: InvalidCardNumber",
    timestamp: "2023-10-05T14:32:11Z",
    status: "Failed",
    merchant: "OnlineClothingStore",
    retryCount: 2,
    lastAttempt: "2023-10-05T14:30:00Z",
  },
  {
    id: "P-1002",
    amount: "$200.00",
    error: "BankAccountNotActive",
    timestamp: "2023-10-05T14:25:45Z",
    status: "Failed",
    merchant: "TravelAgency",
    retryCount: 0,
    lastAttempt: "2023-10-05T14:25:45Z",
  },
  {
    id: "P-1003",
    amount: "$150.00",
    error: "NetworkTimeout",
    timestamp: "2023-10-05T14:15:22Z",
    status: "Failed",
    merchant: "FoodDeliveryService",
    retryCount: 1,
    lastAttempt: "2023-10-05T14:15:22Z",
  },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "amount", label: "Amount" },
  { key: "error", label: "Error" },
  { key: "timestamp", label: "Timestamp" },
  { key: "status", label: "Status" },
  { key: "merchant", label: "Merchant" },
  { key: "retryCount", label: "Retry Count" },
  { key: "lastAttempt", label: "Last Attempt" },
];

const PayoutDetail = ({ payout }: { payout: typeof failedPayouts[0] }) => (
  <Card>
    <h3>Payout ID: {payout.id}</h3>
    <p><strong>Amount:</strong> {payout.amount}</p>
    <p><strong>Error:</strong> {payout.error}</p>
    <p><strong>Timestamp:</strong> {payout.timestamp}</p>
    <p><strong>Status:</strong> <Status tone={payout.status === "Failed" ? "error" : "success"} label={payout.status} /></p>
    <p><strong>Merchant:</strong> {payout.merchant}</p>
    <p><strong>Retry Count:</strong> {payout.retryCount}</p>
    <p><strong>Last Attempt:</strong> {payout.lastAttempt}</p>
  </Card>
);

const FailedPayoutsPage = () => (
  <Page title="Failed Payouts">
    <Header title="Failed Payouts" subtitle="Resolve failed payouts quickly" actions={<Button label="Refresh" />} />
    <Section title="Overview">
      <Card>
        <p>Review and resolve failed payouts to improve payment success rates and customer satisfaction.</p>
      </Card>
    </Section>
    <Section title="Failed Payouts">
      <DataTable
        columns={columns}
        rows={failedPayouts}
        selectable
        stickyFirstColumn
        onRowSelect={(selected) => console.log("Selected payout:", selected)}
      />
    </Section>
    <Section title="Payout Details">
      {failedPayouts.map((payout) => (
        <PayoutDetail key={payout.id} payout={payout} />
      ))}
    </Section>
    <Section title="Actions">
      <Card>
        <Button label="Retry Selected" />
        <Button label="Escalate to Support" />
        <Button label="Mark as Resolved" />
      </Card>
    </Section>
  </Page>
);

export default FailedPayoutsPage;

import { Page, Header, ReviewQueue, Card, Status, Button } from "@stoa/react";

const failedPayouts = [
  {
    id: "payout-001",
    recipient: "Alice Smith",
    amount: "$100.00",
    reason: "Insufficient Funds",
    timestamp: "2023-10-01T14:30:00Z",
    status: "Failed",
    actions: ["Retry", "Escalate", "Mark as Invalid"],
  },
  {
    id: "payout-002",
    recipient: "Bob Johnson",
    amount: "$50.00",
    reason: "Invalid Address",
    timestamp: "2023-10-01T15:15:00Z",
    status: "Failed",
    actions: ["Retry", "Escalate", "Mark as Invalid"],
  },
];

const FailedPayoutsScreen = () => {
  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="Resolve issues with failed payouts" />
      <ReviewQueue
        items={failedPayouts}
        current={failedPayouts[0]}
        decision={(item, action) => (
          <Card title={`Action: ${action}`}>
            <Status tone="warning" label={`Payout ID: ${item.id}`} />
            <p>Recipient: {item.recipient}</p>
            <p>Amount: {item.amount}</p>
            <p>Reason: {item.reason}</p>
            <p>Timestamp: {item.timestamp}</p>
            <Button label="Confirm" onPress={() => console.log(`Action ${action} confirmed for ${item.id}`)} />
          </Card>
        )}
      />
    </Page>
  );
};

export default FailedPayoutsScreen;

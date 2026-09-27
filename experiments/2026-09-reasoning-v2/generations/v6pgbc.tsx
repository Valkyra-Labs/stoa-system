import { Page, Header, ReviewQueue, Button } from "@stoa/react";

const failedPayouts = [
  {
    id: "payout-123",
    recipient: "Alice Smith",
    reason: "Insufficient funds",
    status: "failed",
  },
  {
    id: "payout-456",
    recipient: "Bob Johnson",
    reason: "Invalid account number",
    status: "failed",
  },
  // Add more payouts as needed
];

const actions = [
  { label: "Retry", onPress: () => console.log("Retry") },
  { label: "Update Recipient", onPress: () => console.log("Update Recipient") },
  { label: "Mark as Resolved", onPress: () => console.log("Mark as Resolved") },
];

const ResolveFailedPayouts = () => (
  <Page title="Resolve Failed Payouts">
    <Header title="Failed Payouts" subtitle="Pending for resolution" />
    <ReviewQueue
      items={failedPayouts}
      current={failedPayouts[0]}
      decision={actions}
    />
  </Page>
);

export default ResolveFailedPayouts;

import { Page, Header, ReviewQueue, Button } from "@stoa/react";

const FailedPayouts = () => {
  const payouts = [
    {
      id: "payout-123",
      status: "failed",
      amount: "$100.00",
      reason: "Insufficient funds",
      timestamp: "2023-10-05T14:30:00Z",
    },
    {
      id: "payout-456",
      status: "failed",
      amount: "$250.00",
      reason: "Banking error",
      timestamp: "2023-10-05T15:00:00Z",
    },
    {
      id: "payout-789",
      status: "pending",
      amount: "$300.00",
      reason: "Pending review",
      timestamp: "2023-10-05T15:30:00Z",
    },
  ];

  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="Resolve issues and proceed" />
      <ReviewQueue
        items={payouts}
        current={payouts[0]}
        decision={
          <div>
            <Button label="Mark as Resolved" />
            <Button label="Mark for Review" />
          </div>
        }
      />
    </Page>
  );
};

export default FailedPayouts;

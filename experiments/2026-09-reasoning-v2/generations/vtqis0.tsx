import { Page, Sidebar, Section, Card, Button, ReviewQueue, EmptyData } from "@stoa/react";

const FailedPayouts = () => {
  const failedPayouts = [
    { id: "1", amount: "$100.00", recipient: "John Doe", reason: "Insufficient Funds", timestamp: "2023-10-01" },
    { id: "2", amount: "$50.00", recipient: "Jane Smith", reason: "Account Suspended", timestamp: "2023-10-02" },
    { id: "3", amount: "$200.00", recipient: "Alice Johnson", reason: "Address Verification Failed", timestamp: "2023-10-03" },
  ];

  const handleResolve = (payout) => {
    console.log(`Resolving payout for ${payout.recipient}`);
  };

  const handleMarkException = (payout) => {
    console.log(`Marking payout for ${payout.recipient} as an exception`);
  };

  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="Pending Resolutions" />
      <ReviewQueue
        items={failedPayouts}
        current={failedPayouts[0]}
        decision={{
          primary: (
            <Button label="Resolve" onPress={() => handleResolve(failedPayouts[0])} />
          ),
          secondary: (
            <Button label="Mark as Exception" onPress={() => handleMarkException(failedPayouts[0])} variant="secondary" />
          ),
        }}
      >
        {({ item }) => (
          <Card title={`Failed Payout for ${item.recipient}`}>
            <div>
              <p>Amount: {item.amount}</p>
              <p>Reason: {item.reason}</p>
              <p>Timestamp: {item.timestamp}</p>
            </div>
          </Card>
        )}
      </ReviewQueue>
    </Page>
  );
};

export default FailedPayouts;

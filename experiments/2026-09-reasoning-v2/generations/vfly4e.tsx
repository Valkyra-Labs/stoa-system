import { Page, ReviewQueue, DataTable, Card, Button } from "@stoa/react";

const failedPayouts = [
  { id: "12345", status: "Rejected", reason: "Insufficient funds", amount: "$100.00", timestamp: "2023-10-01T14:30:00Z" },
  { id: "67890", status: "Pending", reason: "Account not found", amount: "$50.00", timestamp: "2023-10-01T15:00:00Z" },
  { id: "54321", status: "Rejected", reason: "Duplicate entry", amount: "$200.00", timestamp: "2023-10-01T15:30:00Z" },
];

const resolvePayout = (id: string) => {
  console.log(`Resolving payout with ID: ${id}`);
};

const FailedPayoutsScreen = () => (
  <Page title="Failed Payouts">
    <ReviewQueue
      items={failedPayouts}
      current={failedPayouts[0]}
      onItemSelect={(item) => console.log(`Selected payout: ${item.id}`)}
    >
      {({ item }) => (
        <>
          <DataTable
            columns={[
              { key: "status", label: "Status" },
              { key: "reason", label: "Reason" },
              { key: "amount", label: "Amount" },
              { key: "timestamp", label: "Timestamp" },
            ]}
            rows={[item]}
            selectable
            onRowSelect={(row) => console.log(`Selected row: ${row.id}`)}
          />
          <Card title="Resolution">
            <Button label="Mark as Resolved" onPress={() => resolvePayout(item.id)} />
          </Card>
        </>
      )}
    </ReviewQueue>
  </Page>
);

export default FailedPayoutsScreen;

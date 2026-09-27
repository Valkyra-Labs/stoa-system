import { Page, Header, Section, Card, Button, DataTable, BulkActions } from "@stoa/react";

const FailedPayouts = () => {
  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="Resolve failed payouts" actions={<Button label="Mark All as Resolved" />} />
      <Section title="Failed Payouts List">
        <DataTable
          columns={[
            { label: "ID", key: "id" },
            { label: "Amount", key: "amount" },
            { label: "Date", key: "date" },
            { label: "Reason", key: "reason" },
          ]}
          rows={[
            { id: "12345", amount: "$100.00", date: "2023-10-01", reason: "Insufficient funds" },
            { id: "67890", amount: "$250.00", date: "2023-10-02", reason: "Bank error" },
            { id: "54321", amount: "$50.00", date: "2023-10-03", reason: "Address not verified" },
          ]}
          selectable
          stickyFirstColumn
          onRowSelect={(row) => console.log(`Selected row: ${row.id}`)}
        />
      </Section>
      <Section title="Resolution Actions">
        <Card title="Resolution Options">
          <BulkActions actions={[
            { label: "Mark as Resolved", onPress: () => console.log("Mark as Resolved") },
            { label: "Retry Payout", onPress: () => console.log("Retry Payout") },
            { label: "Escalate", onPress: () => console.log("Escalate") },
          ]} />
        </Card>
      </Section>
    </Page>
  );
};

export default FailedPayouts;

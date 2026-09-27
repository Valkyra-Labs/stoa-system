import { Page, Sidebar, Section, Card, Button, FilterBar, SavedViews, DataTable, Comparison, Inspector, BulkActions } from "@stoa/react";

export default function FailedPayouts() {
  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="List of failed payouts to review and resolve" actions={<Button label="Refresh" />} />
      <main>
        <FilterBar filters={[{ label: "Status", options: ["Failed", "Pending", "Resolved"] }, { label: "Date Range", options: ["Last 7 Days", "Last 30 Days", "Custom"] }]} />
        <SavedViews views={[{ label: "All Failed", filters: [] }, { label: "Unresolved", filters: [{ label: "Status", value: "Failed" }] }]} />
        <DataTable
          columns={[
            { label: "Payout ID", key: "id" },
            { label: "Amount", key: "amount", type: "number" },
            { label: "Date", key: "date", type: "date" },
            { label: "Status", key: "status" },
            { label: "Reason", key: "reason" },
            { label: "Actions", key: "actions" }
          ]}
          rows={[
            { id: "123456", amount: 100.50, date: new Date(), status: "Failed", reason: "Insufficient Funds", actions: <Button label="Resolve" onPress={() => console.log("Resolving payout")} /> },
            { id: "789012", amount: 250.00, date: new Date(), status: "Failed", reason: "Bank Error", actions: <Button label="Resolve" onPress={() => console.log("Resolving payout")} /> },
            { id: "345678", amount: 150.75, date: new Date(), status: "Failed", reason: "Address Mismatch", actions: <Button label="Resolve" onPress={() => console.log("Resolving payout")} /> }
          ]}
          selectable={true}
          stickyFirstColumn={true}
          onRowSelect={(row) => console.log(`Selected payout ${row.id}`)}
        />
        <BulkActions actions={[{ label: "Mark as Resolved", onPress: () => console.log("Marking as resolved") }]} />
      </main>
    </Page>
  );
}

import { Page, Header, Sidebar, Section, Card, DataTable, Button, BulkActions, FilterBar, SavedViews, Status, EmptyData, PartialData, StaleData, ErrorData } from "@stoa/react";

const failedPayouts = [
  { id: 1, status: "failed", reason: "Insufficient funds", amount: 150.00, date: "2023-10-01" },
  { id: 2, status: "failed", reason: "Bank account closed", amount: 200.00, date: "2023-10-02" },
  { id: 3, status: "resolved", reason: "Insufficient funds", amount: 100.00, date: "2023-10-01" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "status", label: "Status" },
  { key: "reason", label: "Reason" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
];

const actions = [
  { label: "Retry", onPress: () => console.log("Retry pressed") },
  { label: "Mark as Resolved", onPress: () => console.log("Mark as Resolved pressed") },
];

const toolbarFilters = [
  { label: "All", value: "all" },
  { label: "Failed", value: "failed" },
  { label: "Resolved", value: "resolved" },
];

const views = [
  { label: "All", filters: ["all"] },
  { label: "Failed", filters: ["failed"] },
  { label: "Resolved", filters: ["resolved"] },
];

const PayoutResolution = () => (
  <Page title="Failed Payouts Resolution">
    <Header title="Failed Payouts" subtitle="Review and resolve failed payouts" actions={<Button label="Add Payout" variant="primary" />} />
    <Section title="Filters">
      <FilterBar filters={toolbarFilters} />
      <SavedViews views={views} />
    </Section>
    <Section title="Failed Payouts List">
      <DataTable
        columns={columns}
        rows={failedPayouts}
        selectable
        stickyFirstColumn
        onRowSelect={() => console.log("Row selected")}
      />
      <BulkActions actions={actions} />
    </Section>
  </Page>
);

export default PayoutResolution;

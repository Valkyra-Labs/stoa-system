import { Page, Header, Sidebar, Section, Card, DataTable, Button, FilterBar, EmptyData, Metric, Delta, Tabs, Tab, Status, StatusTone } from "@stoa/react";

const FailedPayoutsPage = () => {
  const filters = [
    { label: "Date Range", value: "2023-09-01 to 2023-09-30" },
    { label: "Payment Method", value: "Bank Transfer" },
    { label: "Failure Reason", value: "Invalid Account" },
  ];

  const tableColumns = [
    { key: "id", label: "Payout ID" },
    { key: "amount", label: "Amount" },
    { key: "reason", label: "Failure Reason" },
    { key: "status", label: "Status" },
  ];

  const tableRows = [
    { id: "PAYOUT-12345", amount: "$500.00", reason: "Invalid Account", status: <Status tone={StatusTone.Error}>Failed</Status> },
    { id: "PAYOUT-67890", amount: "$300.00", reason: "Insufficient Funds", status: <Status tone={StatusTone.Error}>Failed</Status> },
    { id: "PAYOUT-11223", amount: "$200.00", reason: "Expired Card", status: <Status tone={StatusTone.Error}>Failed</Status> },
  ];

  const resolvePayout = (id: string) => {
    alert(`Resolving payout: ${id}`);
  };

  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="Review and resolve failed payment attempts" actions={<Button label="New Payout" onPress={() => {}} />} />
      <Sidebar>
        <Section title="Filters">
          <FilterBar filters={filters} />
        </Section>
        <Section title="Saved Views">
          <Button label="Default View" onPress={() => {}} />
          <Button label="By Date" onPress={() => {}} />
          <Button label="By Reason" onPress={() => {}} />
        </Section>
      </Sidebar>
      <main>
        <Section title="Failed Payouts">
          <Card>
            <DataTable
              columns={tableColumns}
              rows={tableRows}
              selectable
              onRowSelect={(row) => {
                alert(`Selected payout: ${row.id}`);
              }}
            />
          </Card>
        </Section>
        <Section title="Resolution Actions">
          <Card>
            <Tabs>
              <Tab id="overview" label="Overview">
                <Metric label="Total Failed" value="3" />
                <Metric label="Average Amount" value="$333.33" unit="USD" />
                <Delta value="-15%" basis="Last Week" />
              </Tab>
              <Tab id="details" label="Details">
                <p>Select a payout to view detailed information and resolution options.</p>
              </Tab>
            </Tabs>
          </Card>
        </Section>
      </main>
    </Page>
  );
};

export default FailedPayoutsPage;

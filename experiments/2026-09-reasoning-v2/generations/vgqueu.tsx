import { Page, Header, Sidebar, Section, Card, Explorer } from "@stoa/react";

const FailedPayouts = () => {
  const filters = [
    { id: "dateRange", label: "Date Range" },
    { id: "failureReason", label: "Failure Reason" },
  ];

  const columns = [
    { id: "id", label: "Payout ID" },
    { id: "date", label: "Date" },
    { id: "amount", label: "Amount" },
    { id: "status", label: "Status" },
    { id: "failureReason", label: "Failure Reason" },
  ];

  const rows = [
    { id: "1", date: "2023-10-01", amount: "$100.00", status: "Failed", failureReason: "Insufficient Funds" },
    { id: "2", date: "2023-10-02", amount: "$200.00", status: "Failed", failureReason: "Invalid Recipient" },
    { id: "3", date: "2023-10-03", amount: "$300.00", status: "Failed", failureReason: "Bank Error" },
  ];

  const detailPanel = (
    <Card title="Payout Details">
      <p>Payout ID: 1</p>
      <p>Date: 2023-10-01</p>
      <p>Amount: $100.00</p>
      <p>Status: Failed</p>
      <p>Failure Reason: Insufficient Funds</p>
      <Button label="Resolve" onPress={() => console.log("Resolve payout")} />
    </Card>
  );

  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="Review and resolve failed payouts" actions={<Button label="Refresh" />} />
      <Sidebar>
        <Section title="Navigation">
          <nav>
            <ul>
              <li>Failed Payouts</li>
              <li>Successful Payouts</li>
              <li>Settings</li>
            </ul>
          </nav>
        </Section>
      </Sidebar>
      <Section title="Failed Payouts">
        <Explorer
          toolbar={<FilterBar filters={filters} />}
          table={<DataTable columns={columns} rows={rows} selectable />}
          detail={detailPanel}
        />
      </Section>
    </Page>
  );
};

export default FailedPayouts;

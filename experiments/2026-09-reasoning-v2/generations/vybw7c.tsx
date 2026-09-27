import { Page, Header, Sidebar, Section, Card, DataTable, Button, FilterBar, Drawer, Metric, Delta, EmptyData } from "@stoa/react";

const FailedPayoutsPage = () => {
  const failedPayouts = [
    { id: "P001", amount: 150, status: "Failed", reason: "Bank account not found", createdAt: "2023-04-05" },
    { id: "P002", amount: 300, status: "Failed", reason: "Insufficient funds", createdAt: "2023-04-05" },
    { id: "P003", amount: 200, status: "Failed", reason: "Invalid card number", createdAt: "2023-04-04" },
    { id: "P004", amount: 400, status: "Failed", reason: "Transaction declined", createdAt: "2023-04-03" },
  ];

  const summaryMetrics = [
    { label: "Total Failed Amount", value: 1050, unit: "USD" },
    { label: "Number of Failed Payouts", value: 4 },
    { label: "Failed Rate", value: 25, delta: -5, unit: "%" },
  ];

  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="Resolve failed transactions and improve payment success rates" actions={<Button label="Retry All" variant="primary" />} />
      <Sidebar>
        <FilterBar filters={[{ label: "Status", value: "Failed", options: ["Failed", "Pending", "Success"] }]} />
      </Sidebar>
      <main>
        <Section title="Overview">
          <Card>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {summaryMetrics.map((metric, index) => (
                <Metric key={index} label={metric.label} value={metric.value} delta={metric.delta} unit={metric.unit} />
              ))}
            </div>
          </Card>
        </Section>
        <Section title="Failed Payouts List">
          <DataTable
            columns={[
              { key: "id", label: "Payout ID" },
              { key: "amount", label: "Amount" },
              { key: "status", label: "Status" },
              { key: "reason", label: "Reason" },
              { key: "createdAt", label: "Created At" },
              { key: "actions", label: "Actions" },
            ]}
            rows={failedPayouts.map(payout => ({
              id: payout.id,
              amount: `${payout.amount} USD`,
              status: <Status tone={payout.status === "Failed" ? "danger" : "warning"} label={payout.status} />,
              reason: payout.reason,
              createdAt: payout.createdAt,
              actions: (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button label="Retry" variant="secondary" />
                  <Button label="Investigate" variant="secondary" />
                  <Button label="Escalate" variant="secondary" />
                </div>
              ),
            }))}
            selectable
            onRowSelect={(selected) => console.log("Selected:", selected)}
          />
        </Section>
      </main>
      <Drawer title="Payout Details" open={false}>
        <Card>
          <p><strong>Payout ID:</strong> P001</p>
          <p><strong>Amount:</strong> $150 USD</p>
          <p><strong>Status:</strong> Failed</p>
          <p><strong>Reason:</strong> Bank account not found</p>
          <p><strong>Created At:</strong> 2023-04-05</p>
          <Button label="Retry" variant="primary" />
          <Button label="Investigate" variant="secondary" />
          <Button label="Escalate" variant="secondary" />
        </Card>
      </Drawer>
    </Page>
  );
};

export default FailedPayoutsPage;

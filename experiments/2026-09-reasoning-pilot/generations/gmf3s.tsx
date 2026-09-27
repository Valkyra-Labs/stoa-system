import {
  Page,
  Header,
  Explorer,
  DataTable,
  FilterBar,
  Section,
  Card,
  Button,
  Status,
  Metric,
  BulkActions,
} from "@stoa/react";

export default function FailedPayoutsScreen() {
  const failedPayouts = [
    {
      id: "PO-2026-0847",
      merchant: "Maple Street Bakery",
      amount: "$2,450.00",
      currency: "USD",
      reason: "Insufficient funds",
      date: "2026-09-26",
      retries: 3,
      customer_contact: "Not attempted",
    },
    {
      id: "PO-2026-0846",
      merchant: "Urban Threads Inc",
      amount: "$8,920.00",
      currency: "USD",
      reason: "Account closed",
      date: "2026-09-26",
      retries: 2,
      customer_contact: "Pending response",
    },
    {
      id: "PO-2026-0845",
      merchant: "Pacific Logistics",
      amount: "$15,600.00",
      currency: "USD",
      reason: "Blocked by bank",
      date: "2026-09-25",
      retries: 1,
      customer_contact: "Not attempted",
    },
    {
      id: "PO-2026-0844",
      merchant: "Fresh Food Co",
      amount: "$3,240.00",
      currency: "USD",
      reason: "Invalid account number",
      date: "2026-09-25",
      retries: 4,
      customer_contact: "Contacted",
    },
    {
      id: "PO-2026-0843",
      merchant: "TechStart Solutions",
      amount: "$12,750.00",
      currency: "USD",
      reason: "Network timeout",
      date: "2026-09-24",
      retries: 5,
      customer_contact: "Not attempted",
    },
  ];

  const columns = [
    { key: "id", label: "Payout ID" },
    { key: "merchant", label: "Merchant" },
    { key: "amount", label: "Amount" },
    { key: "reason", label: "Failure Reason" },
    { key: "date", label: "Failed Date" },
    { key: "retries", label: "Retry Attempts" },
    { key: "customer_contact", label: "Customer Status" },
  ];

  return (
    <Page title="Failed Payouts Resolution">
      <Header
        title="Failed Payouts"
        subtitle="Review and resolve pending payouts"
        actions={
          <Button label="Refresh" variant="secondary" />
        }
      />

      <Explorer
        toolbar={
          <FilterBar
            filters={[
              { key: "reason", label: "Failure Reason", type: "select" },
              { key: "date", label: "Failed After", type: "date" },
              { key: "amount", label: "Amount Range", type: "number" },
              { key: "contact_status", label: "Customer Contact", type: "select" },
            ]}
          />
        }
        table={
          <Section title={`${failedPayouts.length} Failed Payouts`}>
            <DataTable
              columns={columns}
              rows={failedPayouts}
              selectable={true}
              stickyFirstColumn={true}
            />
          </Section>
        }
        detail={
          <Card title="Resolution Actions">
            <Section>
              <div style={{ marginBottom: "16px" }}>
                <Metric
                  label="Total Pending"
                  value={failedPayouts.reduce((sum, p) => sum + parseFloat(p.amount.replace(/[^0-9.]/g, "")), 0).toFixed(2)}
                  unit="USD"
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <p>
                  <strong>Selected Payout:</strong> PO-2026-0847 (Maple Street Bakery)
                </p>
                <p>
                  <strong>Amount:</strong> $2,450.00
                </p>
                <p>
                  <strong>Issue:</strong> Insufficient funds
                </p>
              </div>
            </Section>

            <Section title="Actions">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Button label="Retry Payment" variant="primary" />
                <Button label="Contact Merchant" variant="secondary" />
                <Button label="Issue Refund" variant="secondary" />
                <Button label="Mark as Resolved" variant="secondary" />
                <Button label="Escalate to Support" variant="secondary" />
              </div>
            </Section>

            <Section title="Notes">
              <p>Add resolution notes or customer communication details here.</p>
            </Section>
          </Card>
        }
      />
    </Page>
  );
}

import {
  Page,
  ReviewQueue,
  Section,
  Card,
  Metric,
  Status,
  Button,
  Timeline,
  AuditLog,
  DataTable,
  Header,
} from "@stoa/react";

const failedPayouts = [
  {
    id: "payout_001",
    payee: "Acme Corp",
    amount: 2500.00,
    currency: "USD",
    status: "failed",
    failureReason: "Insufficient funds in source account",
    failureCode: "NSF_001",
    requestDate: "2026-09-25T14:32:00Z",
    failedAt: "2026-09-25T14:35:42Z",
    recipient: {
      name: "Acme Corp",
      accountNumber: "****5678",
      routingNumber: "021000021",
      bankName: "Chase Bank",
    },
    retryAttempts: 1,
    relatedPayouts: 3,
  },
  {
    id: "payout_002",
    payee: "TechStart Inc",
    amount: 1250.50,
    currency: "USD",
    status: "failed",
    failureReason: "Recipient account closed",
    failureCode: "ACC_CLOSED_002",
    requestDate: "2026-09-26T09:15:00Z",
    failedAt: "2026-09-26T09:17:18Z",
    recipient: {
      name: "TechStart Inc",
      accountNumber: "****9012",
      routingNumber: "031000106",
      bankName: "Wells Fargo",
    },
    retryAttempts: 0,
    relatedPayouts: 1,
  },
  {
    id: "payout_003",
    payee: "Global Services Ltd",
    amount: 5800.00,
    currency: "USD",
    status: "failed",
    failureReason: "Bank returned payment - duplicate",
    failureCode: "DUP_TXN_003",
    requestDate: "2026-09-26T16:45:00Z",
    failedAt: "2026-09-26T16:48:05Z",
    recipient: {
      name: "Global Services Ltd",
      accountNumber: "****3456",
      routingNumber: "121000248",
      bankName: "Bank of America",
    },
    retryAttempts: 2,
    relatedPayouts: 5,
  },
];

const auditEntries = [
  {
    timestamp: "2026-09-26T09:18:00Z",
    actor: "system",
    action: "Automatic retry attempted",
    result: "Failed",
  },
  {
    timestamp: "2026-09-26T09:15:00Z",
    actor: "finance-api",
    action: "Payout created",
    result: "Initiated",
  },
  {
    timestamp: "2026-09-25T14:32:00Z",
    actor: "batch-processor",
    action: "Batch queued for processing",
    result: "Queued",
  },
];

export default function PayoutResolutionQueue() {
  return (
    <Page title="Failed Payouts Resolution">
      <ReviewQueue
        items={failedPayouts.map((payout) => ({
          id: payout.id,
          label: `${payout.payee} - $${payout.amount.toFixed(2)}`,
          badge: payout.failureCode,
        }))}
        current={failedPayouts[0]}
        decision={
          <div>
            <Section title="Resolution Actions">
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Button label="Retry Payment" variant="primary" />
                <Button label="Update Recipient Info" variant="secondary" />
                <Button label="Escalate to Finance" variant="secondary" />
                <Button label="Mark as Resolved" variant="secondary" />
              </div>
            </Section>
          </div>
        }
      >
        <Header
          title={`${failedPayouts[0].payee}`}
          subtitle={`Payout ID: ${failedPayouts[0].id}`}
        />

        <Section title="Payout Details">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            <Metric label="Amount" value={`$${failedPayouts[0].amount.toFixed(2)}`} unit="USD" />
            <Metric label="Status" value={<Status tone="critical" label="Failed" />} />
            <Metric label="Request Date" value="2026-09-25" />
            <Metric label="Failed At" value="2026-09-25 14:35:42" />
          </div>
        </Section>

        <Section title="Failure Information">
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666" }}>
                  Error Code
                </p>
                <p style={{ margin: "0", fontWeight: 600 }}>
                  {failedPayouts[0].failureCode}
                </p>
              </div>
              <div>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666" }}>
                  Retry Attempts
                </p>
                <p style={{ margin: "0", fontWeight: 600 }}>
                  {failedPayouts[0].retryAttempts}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
              <p style={{ margin: "0", fontSize: "14px" }}>
                {failedPayouts[0].failureReason}
              </p>
            </div>
          </Card>
        </Section>

        <Section title="Recipient Account">
          <DataTable
            columns={[
              { key: "field", label: "Field" },
              { key: "value", label: "Value" },
            ]}
            rows={[
              { field: "Account Holder", value: failedPayouts[0].recipient.name },
              { field: "Account Number", value: failedPayouts[0].recipient.accountNumber },
              { field: "Routing Number", value: failedPayouts[0].recipient.routingNumber },
              { field: "Bank", value: failedPayouts[0].recipient.bankName },
            ]}
          />
        </Section>

        <Section title="Transaction History">
          <AuditLog entries={auditEntries} />
        </Section>

        <Section title="Related Payouts">
          <Metric
            label="Payouts to this recipient"
            value={failedPayouts[0].relatedPayouts}
            delta={{ value: 2, basis: "last 30 days" }}
          />
          <p style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}>
            {failedPayouts[0].relatedPayouts} total payouts to {failedPayouts[0].payee} in the system
          </p>
        </Section>
      </ReviewQueue>
    </Page>
  );
}

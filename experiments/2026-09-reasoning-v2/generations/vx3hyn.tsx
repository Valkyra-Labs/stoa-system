import { Page, Header, Sidebar, Section, Card, DataTable, Button, Status, EmptyData, Metric, AuditLog } from "@stoa/react";

// Realistic placeholder data for failed payouts
const failedPayouts = [
  { id: "PKT-8821", merchant: "TechStore Global", amount: 1250.00, currency: "USD", status: "FAILED", reason: "Insufficient Funds", timestamp: "2023-10-24T14:30:00Z", retryCount: 0 },
  { id: "PKT-8822", merchant: "FreshMart Supply", amount: 450.50, currency: "EUR", status: "FAILED", reason: "Card Declined", timestamp: "2023-10-24T14:35:00Z", retryCount: 1 },
  { id: "PKT-8823", merchant: "CloudServices Inc", amount: 8900.00, currency: "USD", status: "FAILED", reason: "Account Frozen", timestamp: "2023-10-24T14:40:00Z", retryCount: 2 },
  { id: "PKT-8824", merchant: "RetailOutlet LLC", amount: 320.00, currency: "GBP", status: "FAILED", reason: "Invalid Routing", timestamp: "2023-10-24T14:45:00Z", retryCount: 0 },
  { id: "PKT-8825", merchant: "EcoBikes Ltd", amount: 15600.00, currency: "USD", status: "FAILED", reason: "Compliance Block", timestamp: "2023-10-24T14:50:00Z", retryCount: 0 },
  { id: "PKT-8826", merchant: "GadgetHub", amount: 780.25, currency: "USD", status: "FAILED", reason: "Insufficient Funds", timestamp: "2023-10-24T14:55:00Z", retryCount: 3 },
  { id: "PKT-8827", merchant: "HomeDecor Pro", amount: 2100.00, currency: "EUR", status: "FAILED", reason: "Network Timeout", timestamp: "2023-10-24T15:00:00Z", retryCount: 0 },
  { id: "PKT-8828", merchant: "AutoParts Direct", amount: 5600.00, currency: "USD", status: "FAILED", reason: "Invalid Routing", timestamp: "2023-10-24T15:05:00Z", retryCount: 1 },
  { id: "PKT-8829", merchant: "FashionForward", amount: 1200.00, currency: "GBP", status: "FAILED", reason: "Card Declined", timestamp: "2023-10-24T15:10:00Z", retryCount: 2 },
  { id: "PKT-8830", merchant: "SportZone", amount: 3400.00, currency: "USD", status: "FAILED", reason: "Account Frozen", timestamp: "2023-10-24T15:15:00Z", retryCount: 0 },
];

const auditLogEntries = [
  { id: "AUD-1", action: "Payout Failed", user: "System", time: "2023-10-24T14:30:00Z", details: "PKT-8821 rejected by bank" },
  { id: "AUD-2", action: "Manual Retry", user: "analyst_jane", time: "2023-10-24T14:32:00Z", details: "PKT-8822 retried with new card token" },
  { id: "AUD-3", action: "Payout Failed", user: "System", time: "2023-10-24T14:32:00Z", details: "PKT-8822 rejected due to CVV mismatch" },
];

export default function FailedPayoutsScreen() {
  return (
    <Page title="Failed Payouts Resolution">
      <Header title="Failed Payouts" subtitle="Work queue for resolution" />
      <main className="grid grid-cols-12 gap-6 p-6">
        <aside className="col-span-3">
          <Section title="Filters & Actions">
            <Card title="Status Filter">
              <div className="space-y-2">
                <Button label="All Statuses" onPress={() => {}} />
                <Button label="Insufficient Funds" onPress={() => {}} />
                <Button label="Card Declined" onPress={() => {}} />
                <Button label="Account Frozen" onPress={() => {}} />
              </div>
            </Card>
            <Card title="Bulk Actions">
              <div className="space-y-2">
                <Button label="Retry All Selected" variant="primary" onPress={() => {}} />
                <Button label="Skip & Close" variant="secondary" onPress={() => {}} />
                <Button label="Export to CSV" onPress={() => {}} />
              </div>
            </Card>
            <Card title="Metrics">
              <div className="space-y-3">
                <Metric label="Total Failed" value="302" unit="payouts" />
                <Metric label="Avg. Retry Rate" value="2.4" unit="%" />
                <Metric label="Pending Review" value="12" unit="items" />
              </div>
            </Card>
          </Section>
        </aside>

        <section className="col-span-9">
          <Section title="Resolution Queue">
            <Card title="Failed Transactions">
              <DataTable
                columns={[
                  { key: "id", label: "Transaction ID" },
                  { key: "merchant", label: "Merchant" },
                  { key: "amount", label: "Amount", format: "$" },
                  { key: "reason", label: "Reason Code" },
                  { key: "retryCount", label: "Retry Attempts" },
                  { key: "timestamp", label: "Failed At" },
                  { key: "status", label: "Status" },
                ]}
                rows={failedPayouts}
                selectable
                stickyFirstColumn
              />
            </Card>
            <Section title="Resolution History">
              <Card title="Audit Log">
                <AuditLog entries={auditLogEntries} />
              </Card>
            </Section>
          </Section>
        </section>
      </main>
    </Page>
  );
}

import { Page, Header, Section, Card, DataTable, Button, Status, EmptyData, Section as SectionComp, Tabs, Drawer } from "@stoa/react";

const TABS = {
  LIST: "failed-list",
  DETAILS: "details",
  METRICS: "metrics",
};

const PLACEHOLDER_ROWS = [
  {
    id: "TX-99281",
    amount: 42.50,
    currency: "USD",
    merchant: "GroceryMart",
    failureCode: "INSUFF_FUNDS",
    timestamp: "2023-10-24T14:30:00Z",
    ageHours: 6,
    retryable: true,
    notes: "Customer notified via email.",
  },
  {
    id: "TX-99282",
    amount: 120.00,
    currency: "USD",
    merchant: "TechStore",
    failureCode: "GATEWAY_TIMEOUT",
    timestamp: "2023-10-24T15:10:00Z",
    ageHours: 4,
    retryable: true,
    notes: "Gateway returned 504. Retry recommended.",
  },
  {
    id: "TX-99283",
    amount: 850.00,
    currency: "USD",
    merchant: "Airline",
    failureCode: "CARD_DECLINED",
    timestamp: "2023-10-23T09:00:00Z",
    ageHours: 25,
    retryable: false,
    notes: "Expired card. Escalated to support.",
  },
  {
    id: "TX-99284",
    amount: 15.99,
    currency: "USD",
    merchant: "CoffeeShop",
    failureCode: "INVALID_FORMAT",
    timestamp: "2023-10-24T16:45:00Z",
    ageHours: 2,
    retryable: true,
    notes: "Amount field malformed. Retrying now.",
  },
  {
    id: "TX-99285",
    amount: 3400.00,
    currency: "USD",
    merchant: "LuxuryGoods",
    failureCode: "ACCOUNT_LOCKED",
    timestamp: "2023-10-22T11:20:00Z",
    ageHours: 48,
    retryable: false,
    notes: "FRA flag triggered. Manual review pending.",
  },
];

function FailedPayoutsScreen() {
  return (
    <Page title="Failed Payouts Resolution">
      <Header title="Failed Payouts" subtitle="Daily backlog resolution" />

      <Section title="Summary" className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <Card title="Total Failed Amount">
            <Metric label="Total Value" value="2,378.49" unit="USD" />
            <Delta value={12.5} basis="vs yesterday" />
          </Card>
          <Card title="Backlog Status">
            <Metric label="Avg Age" value="16.2" unit="hours" />
            <Status tone="warning" label="High Priority" />
          </Card>
        </div>
      </Section>

      <Section title="Resolution Queue">
        <Card title="Failed Transactions">
          <Tabs items={[
            { id: TABS.LIST, label: "List View" },
            { id: TABS.METRICS, label: "Metrics" },
          ]}>
            {(() => {
              const rows = PLACEHOLDER_ROWS;
              const columns = [
                { key: "id", label: "Transaction ID" },
                { key: "amount", label: "Amount" },
                { key: "merchant", label: "Merchant" },
                { key: "failureCode", label: "Failure Code" },
                { key: "ageHours", label: "Age (hrs)" },
                { key: "retryable", label: "Retryable" },
              ];

              return (
                <DataTable
                  columns={columns}
                  rows={rows}
                  selectable
                  onRowSelect={(row) => {
                    // In a real app, this would open a detail drawer or modal
                    // For this shell, we simulate the "Inspect" pattern by
                    // highlighting the row and showing status.
                    console.log("Selected for inspection:", row);
                  }}
                />
              );
            })()}
          </Tabs>
        </Card>
      </Section>

      <Section title="Actions">
        <Card title="Bulk Actions">
          <Button label="Retry Selected" onPress={() => alert("Retry initiated for selected items")} variant="primary" />
          <Button label="Force Refund" onPress={() => alert("Refund requested")} variant="danger" />
          <Button label="Export Log" onPress={() => alert("Export completed")} variant="secondary" />
        </Card>
      </Section>
    </Page>
  );
}

export default FailedPayoutsScreen;

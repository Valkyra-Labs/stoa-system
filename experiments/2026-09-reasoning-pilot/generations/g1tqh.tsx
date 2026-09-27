import React, { useState } from "react";
import {
  Page,
  Header,
  Explorer,
  DataTable,
  Card,
  Button,
  Status,
  FilterBar,
  BulkActions,
  Metric,
  Section,
} from "@stoa/react";

const FailedPayoutsScreen: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const payoutData = [
    {
      id: "P-2026-0847",
      recipient: "Acme Corp",
      amount: "$5,250.00",
      currency: "USD",
      timestamp: "2026-09-26 14:32 UTC",
      failureReason: "Insufficient funds in source account",
      retries: 2,
      status: "failed",
    },
    {
      id: "P-2026-0848",
      recipient: "Global Logistics Inc",
      amount: "$12,840.50",
      currency: "USD",
      timestamp: "2026-09-26 12:15 UTC",
      failureReason: "Recipient bank returned payment",
      retries: 1,
      status: "failed",
    },
    {
      id: "P-2026-0849",
      recipient: "Tech Solutions Ltd",
      amount: "$3,100.00",
      currency: "USD",
      timestamp: "2026-09-25 18:48 UTC",
      failureReason: "Invalid account number",
      retries: 0,
      status: "failed",
    },
    {
      id: "P-2026-0850",
      recipient: "European Partners GmbH",
      amount: "$8,700.00",
      currency: "EUR",
      timestamp: "2026-09-25 16:22 UTC",
      failureReason: "Timeout during processing",
      retries: 3,
      status: "failed",
    },
    {
      id: "P-2026-0851",
      recipient: "Asia Pacific Holdings",
      amount: "$15,600.00",
      currency: "USD",
      timestamp: "2026-09-25 09:05 UTC",
      failureReason: "System maintenance at provider",
      retries: 1,
      status: "failed",
    },
  ];

  const columns = [
    { key: "id", label: "Payout ID", width: "12%" },
    { key: "recipient", label: "Recipient", width: "18%" },
    { key: "amount", label: "Amount", width: "12%" },
    { key: "timestamp", label: "Timestamp", width: "18%" },
    { key: "failureReason", label: "Failure Reason", width: "28%" },
    { key: "retries", label: "Retries", width: "8%" },
  ];

  const handleRetrySelected = () => {
    alert(`Retrying ${selectedRows.length} payout(s)...`);
    setSelectedRows([]);
  };

  const handleCancelSelected = () => {
    alert(`Cancelling ${selectedRows.length} payout(s)...`);
    setSelectedRows([]);
  };

  const handleResolveSelected = () => {
    alert(`Marking ${selectedRows.length} payout(s) as resolved...`);
    setSelectedRows([]);
  };

  return (
    <Page title="Failed Payouts">
      <Header
        title="Failed Payouts Resolution"
        subtitle="Review and resolve failed payout attempts"
        actions={[
          <Button
            key="export"
            label="Export Report"
            variant="secondary"
            onPress={() => alert("Exporting report...")}
          />,
          <Button
            key="retry-all"
            label="Retry All"
            onPress={() => alert("Retrying all failed payouts...")}
          />,
        ]}
      />

      <div style={{ display: "flex", gap: "20px" }}>
        <aside style={{ flex: "0 0 280px" }}>
          <Section title="Overview">
            <Card>
              <Metric label="Total Failed" value="5" />
              <Metric label="Today" value="2" />
              <Metric label="Pending Retry" value="4" />
            </Card>
          </Section>

          <FilterBar
            filters={[
              {
                id: "all",
                label: "All Failed Payouts",
                count: 5,
                active: activeFilter === "all",
                onPress: () => setActiveFilter("all"),
              },
              {
                id: "high-value",
                label: "High Value (>$10k)",
                count: 2,
                active: activeFilter === "high-value",
                onPress: () => setActiveFilter("high-value"),
              },
              {
                id: "insufficient-funds",
                label: "Insufficient Funds",
                count: 1,
                active: activeFilter === "insufficient-funds",
                onPress: () => setActiveFilter("insufficient-funds"),
              },
              {
                id: "invalid-account",
                label: "Invalid Account",
                count: 1,
                active: activeFilter === "invalid-account",
                onPress: () => setActiveFilter("invalid-account"),
              },
              {
                id: "provider-issue",
                label: "Provider Issue",
                count: 2,
                active: activeFilter === "provider-issue",
                onPress: () => setActiveFilter("provider-issue"),
              },
            ]}
          />
        </aside>

        <main style={{ flex: 1 }}>
          <Card>
            {selectedRows.length > 0 && (
              <BulkActions
                actions={[
                  {
                    id: "retry",
                    label: "Retry Payment",
                    onPress: handleRetrySelected,
                  },
                  {
                    id: "resolve",
                    label: "Mark Resolved",
                    onPress: handleResolveSelected,
                  },
                  {
                    id: "cancel",
                    label: "Cancel Payment",
                    variant: "danger",
                    onPress: handleCancelSelected,
                  },
                ]}
              />
            )}

            <DataTable
              columns={columns}
              rows={payoutData.map((payout) => ({
                id: payout.id,
                ...payout,
                status: (
                  <Status
                    tone="critical"
                    label={payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  />
                ),
              }))}
              selectable
              stickyFirstColumn
              onRowSelect={(rowId) => {
                setSelectedRows((prev) =>
                  prev.includes(rowId as string)
                    ? prev.filter((id) => id !== rowId)
                    : [...prev, rowId as string]
                );
              }}
            />
          </Card>

          {selectedRows.length === 1 && (
            <Card title="Payout Details" style={{ marginTop: "20px" }}>
              {(() => {
                const selected = payoutData.find((p) => p.id === selectedRows[0]);
                return selected ? (
                  <div>
                    <p>
                      <strong>ID:</strong> {selected.id}
                    </p>
                    <p>
                      <strong>Recipient:</strong> {selected.recipient}
                    </p>
                    <p>
                      <strong>Amount:</strong> {selected.amount} {selected.currency}
                    </p>
                    <p>
                      <strong>Timestamp:</strong> {selected.timestamp}
                    </p>
                    <p>
                      <strong>Failure Reason:</strong> {selected.failureReason}
                    </p>
                    <p>
                      <strong>Retry Attempts:</strong> {selected.retries}
                    </p>
                  </div>
                ) : null;
              })()}
            </Card>
          )}
        </main>
      </div>
    </Page>
  );
};

export default FailedPayoutsScreen;

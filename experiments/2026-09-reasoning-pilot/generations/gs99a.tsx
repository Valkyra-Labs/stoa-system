import React, { useState } from "@stoa/react";
import {
  Page,
  Header,
  Section,
  Card,
  Button,
  Status,
  DataTable,
} from "@stoa/react";

/**
 * Failed Payouts Resolution Screen
 *
 * Main goal: Enable payments operators to efficiently work through a queue of
 * failed payouts, understand why each failed, and execute resolution actions.
 *
 * Layout strategy:
 * - Header shows overview metrics (total failed, pending, resolved today).
 * - Two-column layout: current payout details on left, queue list on right.
 * - Current payout shows full context: amounts, failure reason, audit trail.
 * - Action buttons are prominent and show available resolution paths.
 * - Queue sidebar shows remaining items for quick navigation and progress tracking.
 */

export default function FailedPayoutsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const failedPayouts = [
    {
      id: "payout-2024-001",
      recipient: "Acme Corp",
      amount: 15250.00,
      failureReason: "Insufficient funds in source account",
      attempts: 2,
      createdAt: "2024-09-27T09:15:00Z",
    },
    {
      id: "payout-2024-002",
      recipient: "TechStart Inc",
      amount: 8500.00,
      failureReason: "Invalid recipient account number",
      attempts: 1,
      createdAt: "2024-09-27T10:22:00Z",
    },
    {
      id: "payout-2024-003",
      recipient: "Global Services Ltd",
      amount: 42100.00,
      failureReason: "Bank routing error - temporary system issue",
      attempts: 3,
      createdAt: "2024-09-27T11:05:00Z",
    },
    {
      id: "payout-2024-004",
      recipient: "NextGen Solutions",
      amount: 3250.00,
      failureReason: "Recipient account flagged for verification",
      attempts: 1,
      createdAt: "2024-09-27T09:30:00Z",
    },
  ];

  const currentPayout = failedPayouts[currentIndex];
  const resolvedToday = 12;
  const remainingCount = failedPayouts.length - currentIndex - 1;

  const handleMove = () => {
    if (currentIndex < failedPayouts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <Page title="Failed Payouts Resolution">
      <Header
        title="Failed Payouts"
        subtitle={`${failedPayouts.length} failed, ${resolvedToday} resolved today`}
      />

      <main style={{ display: "flex", height: "calc(100vh - 140px)" }}>
        <section style={{ flex: 1, overflow: "auto", padding: "20px" }}>
          <Section title="Current Payout">
            <Card title={currentPayout.recipient}>
              <div style={{ padding: "16px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                    Amount
                  </h3>
                  <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
                    ${currentPayout.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                    Failure Reason
                  </h3>
                  <Status tone="warning" label={currentPayout.failureReason} />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666" }}>
                        Payout ID
                      </h3>
                      <p style={{ margin: 0, fontFamily: "monospace", fontSize: "12px" }}>
                        {currentPayout.id}
                      </p>
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666" }}>
                        Attempts
                      </h3>
                      <p style={{ margin: 0 }}>
                        {currentPayout.attempts}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "24px", borderTop: "1px solid #e0e0e0", paddingTop: "16px" }}>
                  <h3 style={{ margin: "0 0 12px 0" }}>Resolution</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Button
                      label="Retry Payment"
                      onPress={handleMove}
                      variant="primary"
                    />
                    <Button
                      label="Manually Correct & Retry"
                      onPress={handleMove}
                    />
                    <Button
                      label="Escalate to Team"
                      onPress={handleMove}
                    />
                    <Button
                      label="Mark as Disputed"
                      onPress={handleMove}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Section>
        </section>

        <aside style={{ width: "280px", borderLeft: "1px solid #e0e0e0", padding: "20px", overflow: "auto", backgroundColor: "#fafafa" }}>
          <Section title="Queue">
            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                {currentIndex + 1} of {failedPayouts.length}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                {remainingCount} remaining
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {failedPayouts.map((payout, idx) => (
                <div
                  key={payout.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    padding: "12px",
                    backgroundColor:
                      idx === currentIndex ? "#e3f2fd" : "white",
                    border: idx === currentIndex ? "1px solid #2196f3" : "1px solid #e0e0e0",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontWeight: idx === currentIndex ? "bold" : "normal",
                      fontSize: "13px",
                    }}
                  >
                    {payout.recipient}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    ${payout.amount.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </aside>
      </main>
    </Page>
  );
}

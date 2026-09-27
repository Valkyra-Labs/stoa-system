import {
  Page,
  Header,
  Section,
  Card,
  Tabs,
  Metric,
  Trend,
  Timeline,
  AuditLog,
  Status,
  EmptyData,
  DataTable,
  FilterBar,
  Button,
  Drawer,
} from "@stoa/react";

const clientName = "Sarah Mitchell";
const currentFund = "Horizon Growth Fund";
const proposedFund = "Meridian Equity Fund";

const performanceMetrics = [
  { label: "1-Year Return", value: 12.4, delta: 2.1, unit: "%" },
  { label: "3-Year Return", value: 8.7, delta: -1.3, unit: "%" },
  { label: "Volatility", value: 14.2, delta: 0.5, unit: "%" },
  { label: "Expense Ratio", value: 0.75, delta: null, unit: "%" },
];

const fundDetails = [
  { label: "Fund Manager", value: "James Sterling", fund: currentFund },
  { label: "Fund Manager", value: "Elena Ross", fund: proposedFund },
  { label: "AUM", value: "$450M", fund: currentFund },
  { label: "AUM", value: "$120M", fund: proposedFund },
];

const recentEvents = [
  { date: "2023-10-15", title: "Quarterly review completed", type: "info" },
  { date: "2023-09-01", title: "Client rebalanced to Horizon Growth", type: "success" },
  { date: "2023-08-20", title: "Market correction analysis", type: "warning" },
];

const adviserHistory = [
  { user: "Sarah Mitchell", action: "Selected Meridian Equity", date: "2023-10-15", client: "John Doe" },
  { user: "Sarah Mitchell", action: "Selected Horizon Growth", date: "2023-09-01", client: "Sarah Mitchell" },
  { user: "David Chen", action: "Selected Horizon Growth", date: "2023-08-10", client: "Alice Johnson" },
];

export default function FundComparisonScreen() {
  const [selectedFund, setSelectedFund] = React.useState<"current" | "proposed">("proposed");

  return (
    <Page title={`Fund Recommendation: ${clientName}`}>
      <Header
        title="Fund Selection"
        subtitle={`Reviewing options for ${clientName}`}
        actions={
          <Button
            label={selectedFund === "proposed" ? "Approve Meridian" : "Switch to Horizon"}
            onPress={() => {
              if (selectedFund === "proposed") {
                alert("Recommendation approved for Meridian Equity Fund.");
              } else {
                alert("Recommendation confirmed for Horizon Growth Fund.");
              }
            }}
            variant={selectedFund === "proposed" ? "primary" : "secondary"}
          />
        }
      />

      <Section title="Performance Comparison">
        <Card title="Key Metrics Side-by-Side">
          <Tabs
            items={[
              {
                id: "current",
                label: "Current: Horizon Growth",
                content: (
                  <div className="metrics-grid">
                    {performanceMetrics.map((m) => (
                      <Metric
                        key={m.label}
                        label={m.label}
                        value={m.value}
                        delta={m.delta}
                        unit={m.unit}
                      />
                    ))}
                  </div>
                ),
              },
              {
                id: "proposed",
                label: "Proposed: Meridian Equity",
                content: (
                  <div className="metrics-grid">
                    {performanceMetrics.map((m) => (
                      <Metric
                        key={m.label}
                        label={m.label}
                        value={m.value}
                        delta={m.delta}
                        unit={m.unit}
                      />
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </Section>

      <Section title="Fund Profile & Details">
        <Card title="Fund Characteristics">
          <div className="details-grid">
            {fundDetails.map((item, index) => (
              <div key={index} className="detail-row">
                <span className="detail-label">{item.label}</span>
                <span className="detail-value">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Historical Performance">
        <Card title="12-Month Return Trend">
          <Chart
            type="line"
            series={[
              { data: [10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9] },
              { data: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
            ]}
            x="Months"
            y="Return %"
          />
        </Card>
        <Card title="Recent Activity">
          <Timeline events={recentEvents} />
        </Card>
      </Section>

      <Section title="Adviser History">
        <Card title="Past Decisions for Similar Clients">
          <DataTable
            columns={[
              { key: "user", label: "Adviser" },
              { key: "action", label: "Action" },
              { key: "client", label: "Client" },
              { key: "date", label: "Date" },
            ]}
            rows={adviserHistory}
          />
        </Card>
      </Section>

      <Section title="Audit Log">
        <Card title="Recent Audit Log">
          <AuditLog entries={adviserHistory} />
        </Card>
      </Section>
    </Page>
  );
}

import { Page, Header, Section, Card, Metric, Delta, DataTable, Status, EmptyData, StaleData, Button } from "@stoa/react";

const PageFinanceWeekly = () => {
  const topExceptions = [
    { name: "Q3 Marketing Spend", actual: 145000, target: 120000, unit: "USD", change: 25000 },
    { name: "Cloud Infrastructure", actual: 82000, target: 75000, unit: "USD", change: 7000 },
    { name: "Software Licenses", actual: 12000, target: 12000, unit: "USD", change: 0 },
  ];

  const performanceMetrics = [
    { label: "Net Revenue", value: 4500000, unit: "USD", delta: 5.2, basis: "vs. last week" },
    { label: "Gross Margin", value: 38.5, unit: "%", delta: 0.4, basis: "vs. last week" },
    { label: "EBITDA", value: 890000, unit: "USD", delta: -1.2, basis: "vs. last week" },
  ];

  const pendingApprovals = [
    { id: 1, amount: 12500, dept: "Legal", reason: "Contract amendment", status: "Pending" },
    { id: 2, amount: 4500, dept: "IT", reason: "Server upgrade", status: "Pending" },
    { id: 3, amount: 89000, dept: "Sales", reason: "Q4 Bonus pool", status: "Pending" },
  ];

  return (
    <Page title="Weekly Finance Review">
      <Header title="Weekly Finance Review" subtitle="Mon, Oct 23" />
      
      <main>
        <Section title="Critical Exceptions & Variances" >
          <Section title="Top Variance Items" >
            {topExceptions.length > 0 ? (
              <>
                <Card title="Positive Variance (Over Budget)">
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {topExceptions.map((item) => (
                      <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{item.name}</span>
                        <Delta value={item.change} basis={item.target.toLocaleString()} />
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="Negative Variance (Under Budget)">
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>General Ledger Reconciliation</span>
                      <Delta value={-2400} basis={-2500} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Q3 Marketing Spend</span>
                      <Delta value={-25000} basis={-120000} />
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <EmptyData />
            )}
          </Section>
        </Section>

        <Section title="Key Performance Indicators" >
          <Card title="Weekly Performance" >
            {performanceMetrics.length > 0 ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {performanceMetrics.map((metric) => (
                    <Metric
                      key={metric.label}
                      label={metric.label}
                      value={metric.value.toLocaleString()}
                      unit={metric.unit}
                      delta={metric.delta}
                      basis={metric.basis}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyData />
            )}
          </Card>
        </Section>

        <Section title="Pending Approvals" >
          <Card title="Managerial Sign-offs" >
            {pendingApprovals.length > 0 ? (
              <DataTable
                columns={[
                  { key: "amount", label: "Amount", align: "right" },
                  { key: "dept", label: "Department", sticky: true },
                  { key: "reason", label: "Reason" },
                  { key: "status", label: "Status" },
                ]}
                rows={pendingApprovals.map((row) => ({
                  ...row,
                  amount: row.amount.toLocaleString(),
                  status: <Status tone={row.status === "Pending" ? "warning" : "success"} label={row.status} />,
                }))}
                selectable
                bulkActions={{
                  actions: [
                    { label: "Approve All", onPress: () => alert("Approve all selected") },
                    { label: "Reject All", onPress: () => alert("Reject all selected") },
                  ],
                }}
              />
            ) : (
              <EmptyData />
            )}
          </Card>
        </Section>

        <Section title="Data Freshness" >
          <Card title="Live Data Status" >
            <Metric label="Cash Balance" value={12500000} unit="USD" />
            <Metric label="Last Updated" value={new Date().toLocaleTimeString()} unit="" />
            <Status tone="neutral" label="Data is current (refreshed 5m ago)" />
          </Card>
        </Section>
      </main>
    </Page>
  );
};

export default PageFinanceWeekly;

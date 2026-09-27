import { Page, Header, Section, Card, Tabs, Metric, Chart, DataTable, Status, Button, Drawer } from "@stoa/react";

const FundA = { name: "Growth Horizon Fund", expenseRatio: 0.85, ytd: 12.4, volatility: 18.2 };
const FundB = { name: "Steady Value Fund", expenseRatio: 0.60, ytd: 8.1, volatility: 9.5 };

const performanceSeries = [
  { year: 2020, FundA: 10.2, FundB: 5.4 },
  { year: 2021, FundA: 15.8, FundB: 7.2 },
  { year: 2022, FundA: -8.4, FundB: 2.1 },
  { year: 2023, FundA: 18.9, FundB: 6.5 },
];

const returnsData = [
  { month: "Jan", FundA: 1.2, FundB: 0.8 },
  { month: "Feb", FundA: -0.5, FundB: 0.3 },
  { month: "Mar", FundA: 2.1, FundB: 1.5 },
  { month: "Apr", FundA: 1.8, FundB: 0.9 },
  { month: "May", FundA: 2.4, FundB: 1.2 },
];

const AuditLog = [
  { action: "Added to comparison", user: "Sarah J.", time: "2 mins ago" },
  { action: "Updated portfolio allocation", user: "Client", time: "1 hour ago" },
];

const RecommendationDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Drawer title="Recommendation Summary" open={open} onClose={onClose}>
    <Card title="Adviser Note">
      <p>Based on the client's risk profile (Moderate) and current market conditions, the <strong>{FundA.name}</strong> offers higher growth potential with acceptable volatility, making it the recommended choice for rebalancing.</p>
      <Button label="Approve Recommendation" onPress={() => alert("Approved")}>Approve</Button>
      <Button label="Re-evaluate" onPress={() => alert("Re-evaluation requested")}>Re-evaluate</Button>
    </Card>
  </Drawer>
);

export default function FundSelector() {
  const [drawerOpen, setDrawerOpen] = false;

  return (
    <Page title="Fund Comparison & Recommendation">
      <Header title="Client Fund Selection" subtitle="Compare funds and generate recommendations" actions={
        <Button label="New Comparison" onPress={() => alert("New comparison started")} />
      } />
      
      <Section title="Comparison Overview">
        <Tabs items={[
          { id: "overview", label: "Overview", content: (
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <Card title="Fund A: Growth Horizon">
                <Metric label="Expense Ratio" value={FundA.expenseRatio} unit="%" />
                <Metric label="YTD Return" value={FundA.ytd} unit="%" />
                <Metric label="Volatility" value={FundA.volatility} unit="%" />
                <Chart type="line" series={[FundA.name]} x={performanceSeries.map(s => s.year)} y={performanceSeries.map(s => s.FundA)} />
              </Card>
              <Card title="Fund B: Steady Value">
                <Metric label="Expense Ratio" value={FundB.expenseRatio} unit="%" />
                <Metric label="YTD Return" value={FundB.ytd} unit="%" />
                <Metric label="Volatility" value={FundB.volatility} unit="%" />
                <Chart type="line" series={[FundB.name]} x={performanceSeries.map(s => s.year)} y={performanceSeries.map(s => s.FundB)} />
              </Card>
            </div>
          )},
          { id: "deep-dive", label: "Deep Dive", content: (
            <div>
              <Card title="Monthly Performance (Last 5 Months)">
                <DataTable columns={[{ label: "Month", key: "month" }, { label: "Fund A Return", key: "FundA" }, { label: "Fund B Return", key: "FundB" }]} rows={returnsData} />
              </Card>
              <Card title="Market Context Timeline">
                <Timeline events={[
                  { date: "Mar 2022", desc: "Global recession fears", impact: FundA: -5, FundB: 1 },
                  { date: "Sep 2023", desc: "Inflation data release", impact: FundA: 2, FundB: 0.5 },
                ]} />
              </Card>
            </div>
          )},
        ]} />
      </Section>

      <Section title="Detailed Analysis">
        <Card title="Historical Returns & Risk">
          <DataTable columns={[{ label: "Month", key: "month" }, { label: "Fund A Return", key: "FundA" }, { label: "Fund B Return", key: "FundB" }]} rows={returnsData} />
          <p>
            <strong>Fund A</strong> is suitable for growth-oriented clients tolerating short-term dips. 
            <strong>Fund B</strong> provides stability with lower returns, ideal for conservative portfolios.
          </p>
        </Card>
      </Section>

      <Section title="Decision Log">
        <Card title="Activity History">
          <AuditLog entries={AuditLog} />
        </Card>
      </Section>

      <Button label="Generate Recommendation" onPress={() => setDrawerOpen(true)} />
      <RecommendationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Page>
  );
}

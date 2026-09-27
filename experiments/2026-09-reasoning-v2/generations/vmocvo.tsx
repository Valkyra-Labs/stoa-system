import { Page, Header, Sidebar, Section, Card, Chart, DataTable, Comparison, Tabs, Metric, Delta, Status, EmptyData } from "@stoa/react";

const WeeklyFinanceOverview = () => {
  return (
    <Page title="Weekly Finance Overview">
      <Header title="Weekly Financial Summary" subtitle="Monday, April 8, 2025" actions={<Button label="Refresh" onPress={() => {}} variant="primary" />} />
      <Sidebar>
        <Section title="Navigation">
          <Tabs
            items={[
              { id: "overview", label: "Overview", content: <Card title="Key Metrics"><Metric label="Revenue" value="$2.4M" delta={+5.2} unit="USD" /><Metric label="Expenses" value="$1.1M" delta={-2.3} unit="USD" /><Metric label="Net Profit" value="$1.3M" delta={+7.8} unit="USD" /></Card> },
              { id: "trends", label: "Trends", content: <Chart type="line" series={[{ name: "Revenue", data: [2000, 2100, 2200, 2300, 2400] }]} x="Week" y="USD" /> },
              { id: "comparison", label: "Comparison", content: <Comparison entities={["Current Week", "Previous Week"]} metrics={[{ label: "Revenue", value: [2400, 2200] }, { label: "Expenses", value: [1100, 1200] }]} /> },
              { id: "details", label: "Details", content: <DataTable columns={["Week", "Revenue", "Expenses", "Net Profit"]} rows={[[1, 2000, 900, 1100], [2, 2100, 1000, 1100], [3, 2200, 1050, 1150], [4, 2300, 1100, 1200], [5, 2400, 1150, 1250]]} selectable={true} stickyFirstColumn={true} /> },
            ]}
          />
        </Section>
      </Sidebar>
      <main>
        <Section title="Status">
          <Status tone="success" label="All systems operational" />
        </Section>
      </main>
    </Page>
  );
};

export default WeeklyFinanceOverview;

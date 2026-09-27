import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  Trend,
  DataTable,
  Status,
  Button,
  Tabs,
  EmptyData,
} from "@stoa/react";

const WEEKLY_REPORT = {
  period: "Week 2023-W01",
  dateRange: "Oct 02 – Oct 08",
  currency: "$",
};

const METRICS = [
  {
    label: "Revenue",
    value: 1245000,
    delta: 12.5,
    unit: "USD",
    trend: { series: [1100, 1120, 1150, 1180, 1210, 1245] },
    description: "Total revenue for the reporting period.",
  },
  {
    label: "Gross Profit",
    value: 580000,
    delta: 5.2,
    unit: "USD",
    trend: { series: [500, 510, 525, 540, 560, 580] },
    description: "Revenue minus cost of goods sold.",
  },
  {
    label: "EBITDA",
    value: 320000,
    delta: -2.1,
    unit: "USD",
    trend: { series: [340, 335, 330, 328, 322, 320] },
    description: "Earnings before interest, taxes, depreciation, and amortization.",
  },
  {
    label: "Cash Flow",
    value: 85000,
    delta: 8.4,
    unit: "USD",
    trend: { series: [60, 65, 70, 75, 80, 85] },
    description: "Net cash generated from operating activities.",
  },
];

const LINE_ITEMS = [
  { id: 1, description: "Software Licenses", amount: 45000, category: "OpEx" },
  { id: 2, description: "Cloud Infrastructure", amount: 125000, category: "OpEx" },
  { id: 3, description: "Marketing Campaigns", amount: 85000, category: "OpEx" },
  { id: 4, description: "Raw Materials", amount: 210000, category: "COGS" },
  { id: 5, description: "Labor Costs", amount: 150000, category: "COGS" },
  { id: 6, description: "R&D Expenses", amount: 65000, category: "OpEx" },
  { id: 7, description: "Depreciation", amount: 45000, category: "Non-Cash" },
];

const ExportButton = () => (
  <Button label="Export Report" variant="primary" onPress={() => console.log("Exporting")} />
);

export default function WeeklyFinanceReport() {
  return (
    <Page title="Weekly Financial Performance">
      <Header
        title={WEEKLY_REPORT.period}
        subtitle={WEEKLY_REPORT.dateRange}
        actions={<ExportButton />}
      />

      <main>
        <Section title="Executive Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {METRICS.map((m) => (
              <Card key={m.label} title={m.label}>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold">{WEEKLY_REPORT.currency}{m.value.toLocaleString()}</span>
                  <Delta value={m.delta} basis="last_week" />
                </div>
                <p className="text-sm text-gray-500 mt-2">{m.description}</p>
                <Trend series={m.trend.series} />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Line Item Analysis">
          <Tabs
            items={[
              { id: "all", label: "All Categories" },
              { id: "cogs", label: "Cost of Goods Sold" },
              { id: "opex", label: "Operating Expenses" },
            ]}
          >
            {() => (
              <DataTable
                columns={[
                  { key: "description", label: "Description", width: "30%" },
                  { key: "category", label: "Category", width: "15%" },
                  { key: "amount", label: "Amount", width: "25%", align: "right" },
                ]}
                rows={LINE_ITEMS}
                onRowSelect={(row) => console.log("Selected:", row)}
              />
            )}
          </Tabs>
        </Section>

        <Section title="Anomalies & Alerts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Status tone="warning" label="Revenue growth below target (12.5% vs 15%)" />
            <Status tone="success" label="Cash position healthy, 3 months runway" />
            <Status tone="info" label="Marketing spend increased 20% MoM" />
            <Status tone="error" label="Cloud costs exceeded budget by $5k" />
          </div>
        </Section>
      </main>
    </Page>
  );
}

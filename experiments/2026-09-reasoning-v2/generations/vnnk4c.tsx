import { Page, Header, Section, Metric, Delta, DataTable, FilterBar, SavedViews } from "@stoa/react";

export default function FinanceOverview() {
  return (
    <Page title="Finance Overview">
      <Header title="Finance Overview" subtitle="Weekly numbers" />
      <Section title="Key Metrics">
        <Metric label="Revenue" value={1234567.89} unit="USD" />
        <Metric label="Expenses" value={876543.21} unit="USD" />
        <Metric label="Profit" value={358024.68} unit="USD" />
      </Section>
      <Section title="Weekly Changes">
        <Metric label="Revenue Change" value={12345.67} delta={true} basis="Previous Week" />
        <Metric label="Expense Change" value={-789.01} delta={true} basis="Previous Week" />
        <Metric label="Profit Change" value={12524.66} delta={true} basis="Previous Week" />
      </Section>
      <Section title="Financial Data">
        <DataTable
          columns={[
            { label: "Date", key: "date" },
            { label: "Revenue", key: "revenue", unit: "USD" },
            { label: "Expenses", key: "expenses", unit: "USD" },
            { label: "Profit", key: "profit", unit: "USD" },
          ]}
          rows={[
            { date: "2023-10-09", revenue: 1234567.89, expenses: 876543.21, profit: 358024.68 },
            { date: "2023-10-02", revenue: 1222222.22, expenses: 868686.87, profit: 353535.35 },
          ]}
          stickyFirstColumn={true}
        />
      </Section>
      <Section title="Filters">
        <FilterBar filters={[
          { label: "Month", value: "October" },
          { label: "Department", value: "Finance" },
        ]} />
        <SavedViews views={[
          { label: "Current Month", filters: ["Month: October"] },
          { label: "Previous Month", filters: ["Month: September"] },
        ]} />
      </Section>
    </Page>
  );
}

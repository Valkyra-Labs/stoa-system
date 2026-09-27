import { Page, Header, Sidebar, Section, Metric, Chart, DataTable, EmptyData } from "@stoa/react";

export default function FinanceDashboard() {
  return (
    <Page title="Finance Dashboard">
      <Header title="Company Finance" subtitle="Weekly Overview" />
      <Sidebar>
        <p>Quick Links</p>
        <nav>
          <a href="/finance/reports">Detailed Reports</a>
          <a href="/finance/budgets">Budgets</a>
          <a href="/finance/forecast">Forecast</a>
        </nav>
      </Sidebar>
      <main>
        <Section title="Revenue">
          <Metric label="Total Revenue" value={1500000} delta={50000} unit="USD" />
          <Chart type="line" series={[{ label: "Revenue", data: [[0, 1450000], [1, 1500000]] }]} x="Week" y="Revenue" />
        </Section>
        <Section title="Expenses">
          <Metric label="Total Expenses" value={1200000} delta={-20000} unit="USD" />
          <Chart type="bar" series={[{ label: "Expenses", data: [[0, 1220000], [1, 1200000]] }]} x="Week" y="Expenses" />
        </Section>
        <Section title="Profit Margin">
          <Metric label="Profit Margin" value={20} delta={3} unit="%" />
          <Chart type="line" series={[{ label: "Profit Margin", data: [[0, 17], [1, 20]] }]} x="Week" y="Profit Margin" />
        </Section>
        <Section title="Cash Flow">
          <Metric label="Net Cash Flow" value={300000} delta={50000} unit="USD" />
          <Chart type="line" series={[{ label: "Cash Flow", data: [[0, 250000], [1, 300000]] }]} x="Week" y="Cash Flow" />
        </Section>
        <Section title="Detailed Financials">
          <DataTable
            columns={[
              { label: "Week", key: "week" },
              { label: "Revenue", key: "revenue", type: "currency" },
              { label: "Expenses", key: "expenses", type: "currency" },
              { label: "Profit Margin", key: "profitMargin", type: "percentage" },
              { label: "Cash Flow", key: "cashFlow", type: "currency" },
            ]}
            rows={[
              { week: 1, revenue: 1450000, expenses: 1220000, profitMargin: 17, cashFlow: 250000 },
              { week: 2, revenue: 1500000, expenses: 1200000, profitMargin: 20, cashFlow: 300000 },
            ]}
          />
        </Section>
        <Section title="No Data Available">
          <EmptyData />
        </Section>
      </main>
    </Page>
  );
}

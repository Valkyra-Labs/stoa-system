import { Page, Header, Section, Metric, Delta, Trend, Sidebar } from "@stoa/react";

const FinancialOverview = () => {
  const currentWeekRevenue = 500000;
  const previousWeekRevenue = 480000;
  const sameWeekLastYearRevenue = 450000;

  const currentWeekExpenses = 300000;
  const previousWeekExpenses = 290000;
  const sameWeekLastYearExpenses = 280000;

  const currentWeekProfit = currentWeekRevenue - currentWeekExpenses;
  const previousWeekProfit = previousWeekRevenue - previousWeekExpenses;
  const sameWeekLastYearProfit = sameWeekLastYearRevenue - sameWeekLastYearExpenses;

  return (
    <Page title="Financial Overview">
      <Header
        title="Current Week Metrics"
        subtitle="Weekly financial summary"
        actions={<button>Export</button>}
      >
        <Metric label="Revenue" value={currentWeekRevenue} unit="USD" />
        <Metric label="Expenses" value={currentWeekExpenses} unit="USD" />
        <Metric label="Profit" value={currentWeekProfit} unit="USD" />
      </Header>
      <main>
        <Section title="Revenue Comparison">
          <Metric label="Revenue (Current Week)" value={currentWeekRevenue} unit="USD" />
          <Metric label="Revenue (Previous Week)" value={previousWeekRevenue} unit="USD" />
          <Metric label="Revenue (Same Week Last Year)" value={sameWeekLastYearRevenue} unit="USD" />
          <Delta value={currentWeekRevenue - previousWeekRevenue} basis={previousWeekRevenue} />
          <Trend series={[currentWeekRevenue, previousWeekRevenue, sameWeekLastYearRevenue]} />
        </Section>
        <Section title="Expenses Comparison">
          <Metric label="Expenses (Current Week)" value={currentWeekExpenses} unit="USD" />
          <Metric label="Expenses (Previous Week)" value={previousWeekExpenses} unit="USD" />
          <Metric label="Expenses (Same Week Last Year)" value={sameWeekLastYearExpenses} unit="USD" />
          <Delta value={currentWeekExpenses - previousWeekExpenses} basis={previousWeekExpenses} />
          <Trend series={[currentWeekExpenses, previousWeekExpenses, sameWeekLastYearExpenses]} />
        </Section>
        <Sidebar>
          <Section title="Historical Data">
            <p>Historical financial data for reference.</p>
          </Section>
        </Sidebar>
      </main>
    </Page>
  );
};

export default FinancialOverview;

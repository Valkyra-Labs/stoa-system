import { Page, Header, Section, Card, Metric, Delta, Chart, DataTable, Timeline, Status, EmptyData } from '@stoa/react';

const WeeklyFinanceOverview = () => {
  return (
    <Page title="Weekly Finance Overview">
      <Header title="Weekly Financial Summary" subtitle="Monday Review - April 10, 2023" actions={<Button label="Refresh" variant="primary" />} />
      
      <Section title="Key Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Revenue" description="This Week">
            <Metric label="Revenue" value="$1,250,000" delta={+5.2} unit="USD" />
          </Card>
          <Card title="Expenses" description="This Week">
            <Metric label="Expenses" value="$890,000" delta={-2.1} unit="USD" />
          </Card>
          <Card title="Profit" description="This Week">
            <Metric label="Profit" value="$360,000" delta={+7.8} unit="USD" />
          </Card>
          <Card title="Variance" description="vs Previous Week">
            <Delta value={+12.4} basis="Previous Week" />
          </Card>
        </div>
      </Section>

      <Section title="Trends">
        <Card title="Revenue Trend">
          <Chart type="line" series={[{ name: "Revenue", data: [1200000, 1250000, 1300000, 1350000] }]} />
        </Card>
      </Section>

      <Section title="Recent Activity">
        <Timeline events={[
          { date: "Apr 5", description: "New client onboarding completed" },
          { date: "Apr 6", description: "Marketing campaign launched" },
          { date: "Apr 7", description: "IT system upgrade completed" },
          { date: "Apr 8", description: "Product launch event held" },
        ]} />
      </Section>

      <Section title="Detailed Breakdown">
        <DataTable
          columns={['Department', 'Revenue', 'Expenses', 'Profit']}
          rows={[
            ['Sales', '$450,000', '$180,000', '$270,000'],
            ['Marketing', '$300,000', '$210,000', '$90,000'],
            ['Operations', '$250,000', '$350,000', '-$', '$100,000'],
            ['R&D', '$250,000', '$150,000', '$100,000'],
          ]}
        />
      </Section>

      <Section title="Notes">
        <Card title="Notes">
          <p>Revenue increased due to successful product launch and new client onboarding. Expenses decreased slightly due to optimized marketing spend.</p>
        </Card>
      </Section>
    </Page>
  );
};

export default WeeklyFinanceOverview;

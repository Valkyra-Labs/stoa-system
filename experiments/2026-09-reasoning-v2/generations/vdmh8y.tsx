import { Page, Header, Sidebar, Section, Card, Chart, DataTable, Metric, Delta, Tabs, Status, EmptyData } from '@stoa/react';

const SchoolDashboard = () => {
  return (
    <Page title="School Performance Overview">
      <Header title="School Performance Overview" subtitle="Term Progress Report" actions={<div />} />
      <Sidebar>
        <Section title="Filters">
          <FilterBar filters={[{ label: 'Term', value: 'Term 2023-2024' }, { label: 'Grade Level', value: 'All' }]} />
          <SavedViews views={['Overview', 'Detailed', 'By Grade']} />
        </Section>
      </Sidebar>
      <main>
        <Section title="Key Metrics">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <Card title="Student Performance">
              <Metric label="Average Score" value="82.4" unit="%" />
              <Delta value={+2.1} basis="80.3" />
            </Card>
            <Card title="Staff Engagement">
              <Metric label="Attendance Rate" value="96.2%" />
              <Delta value={-0.8} basis="97.0" />
            </Card>
            <Card title="Financial Health">
              <Metric label="Budget Utilization" value="78.5%" />
              <Delta value={+3.2} basis="75.3" />
            </Card>
          </div>
        </Section>
        <Section title="Performance Trends">
          <Chart type="line" series={[{ name: 'Math', data: [80, 82, 84, 86, 88] }, { name: 'English', data: [75, 76, 77, 78, 79] }]} />
        </Section>
        <Section title="Detailed Data">
          <DataTable
            columns={['Subject', 'Average Score', 'Improvement']}
            rows={[
              { Subject: 'Math', 'Average Score': '82.4', Improvement: '+2.1%' },
              { Subject: 'English', 'Average Score': '78.9', Improvement: '+1.5%' },
              { Subject: 'Science', 'Average Score': '75.2', Improvement: '+0.8%' },
            ]}
          />
        </Section>
      </main>
    </Page>
  );
};

export default SchoolDashboard;

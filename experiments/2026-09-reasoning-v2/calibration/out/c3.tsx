import { Page, Header, Section, Card, Metric, Delta, Status, Tabs, Button, DataTable, FilterBar, SavedViews, Explorer, Comparison, Inspector, Monitor, ReviewQueue, EmptyData, StaleData, ErrorData } from '@stoa/react';

const mockData = {
  classResults: {
    totalStudents: 28,
    averageScore: 68,
    medianScore: 72,
    highestScore: 98,
    lowestScore: 32,
    passRate: 71,
    failRate: 29,
    gradeDistribution: {
      A: 12,
      B: 10,
      C: 6,
      D: 4,
      F: 6,
    },
    performanceTrend: [
      { period: '2023-09', average: 65 },
      { period: '2023-10', average: 68 },
      { period: '2023-11', average: 70 },
    ],
  },
  studentDetails: [
    { id: 1, name: 'Alice Johnson', score: 88, grade: 'A', comments: 'Excellent understanding of all topics.' },
    { id: 2, name: 'Bob Smith', score: 75, grade: 'B', comments: 'Needs to review material on fractions.' },
    { id: 3, name: 'Charlie Brown', score: 62, grade: 'C', comments: 'Struggles with word problems.' },
    { id: 4, name: 'Diana Evans', score: 45, grade: 'F', comments: 'Requires additional support.' },
    { id: 5, name: 'Ethan Lee', score: 92, grade: 'A', comments: 'Outstanding performance.' },
  ],
  classPerformance: [
    { id: 'math', label: 'Math', average: 68, delta: 3, basis: 65 },
    { id: 'science', label: 'Science', average: 72, delta: -2, basis: 74 },
    { id: 'english', label: 'English', average: 60, delta: 5, basis: 55 },
  ],
  auditLog: [
    { id: 1, user: 'admin', action: 'Test marked', timestamp: '2023-11-15T14:30:00Z' },
    { id: 2, user: 'admin', action: 'Test marked', timestamp: '2023-11-15T14:35:00Z' },
    { id: 3, user: 'admin', action: 'Test marked', timestamp: '2023-11-15T14:40:00Z' },
  ],
  staleData: {
    since: '2023-11-14T18:00:00Z',
  },
  errorData: {
    retry: 'Refresh data',
  },
};

const TestReviewPage = () => {
  return (
    <Page title="Unit Test Review - Class 10A">
      <Header title="Unit Test Review" subtitle="Class 10A - November 15, 2023" actions={<Button label="Mark Test" variant="primary" />} />
      
      <Section title="Class Overview">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Metric label="Total Students" value={mockData.classResults.totalStudents} />
            <Metric label="Average Score" value={mockData.classResults.averageScore} unit="%" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Metric label="Median Score" value={mockData.classResults.medianScore} unit="%" />
            <Metric label="Pass Rate" value={mockData.classResults.passRate} unit="%" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Metric label="Fail Rate" value={mockData.classResults.failRate} unit="%" />
            <Metric label="Highest Score" value={mockData.classResults.highestScore} unit="%" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Metric label="Lowest Score" value={mockData.classResults.lowestScore} unit="%" />
            <Status tone="neutral" label="Last Updated" />
          </div>
        </Card>
      </Section>

      <Section title="Performance Trends">
        <Card>
          <Trend series={mockData.classResults.performanceTrend} />
          <Chart type="line" series={mockData.classResults.performanceTrend.map(item => ({ label: item.period, value: item.average }))} x="period" y="average" />
        </Card>
      </Section>

      <Section title="Subject Performance">
        <Card>
          <Comparison entities={mockData.classPerformance} metrics={['average']} />
          <DataTable
            columns={[
              { key: 'subject', label: 'Subject' },
              { key: 'average', label: 'Average Score', type: 'number', unit: '%' },
              { key: 'delta', label: 'Change', type: 'delta' },
              { key: 'basis', label: 'Basis', type: 'number', unit: '%' },
            ]}
            rows={mockData.classPerformance}
            selectable
            stickyFirstColumn
            onRowSelect={(selected) => console.log('Selected:', selected)}
          />
        </Card>
      </Section>

      <Section title="Student Details">
        <Explorer
          toolbar={
            <FilterBar filters={['grade', 'score']} />
          }
          table={
            <DataTable
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'score', label: 'Score', type: 'number', unit: '%' },
                { key: 'grade', label: 'Grade' },
                { key: 'comments', label: 'Comments' },
              ]}
              rows={mockData.studentDetails}
              selectable
              stickyFirstColumn
              onRowSelect={(selected) => console.log('Selected:', selected)}
            />
          }
          detail={
            <Inspector primary={mockData.studentDetails[0]} context={mockData.studentDetails} history={mockData.auditLog} actions={<Button label="Review Comments" />} />
          }
        />
      </Section>

      <Section title="Next Steps">
        <Card>
          <ReviewQueue
            items={mockData.studentDetails}
            current={mockData.studentDetails[0]}
            decision={
              <Button label="Approve" variant="success" />
            }
          />
        </Card>
      </Section>

      <Section title="Audit Log">
        <Card>
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'user', label: 'User' },
              { key: 'action', label: 'Action' },
              { key: 'timestamp', label: 'Timestamp' },
            ]}
            rows={mockData.auditLog}
          />
        </Card>
      </Section>

      <Section title="Data Status">
        <Card>
          <StaleData since={mockData.staleData.since} />
          <ErrorData retry={mockData.errorData.retry} />
        </Card>
      </Section>
    </Page>
  );
};

export default TestReviewPage;

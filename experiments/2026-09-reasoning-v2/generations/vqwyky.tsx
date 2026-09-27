import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, DataTable, Tabs, Status, EmptyData } from '@stoa/react';

const schoolPerformanceData = {
  studentPerformance: {
    label: 'Student Performance',
    value: 85,
    delta: 2,
    unit: '%',
    trend: [80, 82, 84, 85],
  },
  staffMetrics: {
    label: 'Staff Metrics',
    value: 90,
    delta: -1,
    unit: '%',
    trend: [92, 91, 90, 90],
  },
  financialHealth: {
    label: 'Financial Health',
    value: 78,
    delta: 5,
    unit: '%',
    trend: [75, 76, 77, 78],
  },
  safetyIndicators: {
    label: 'Safety Indicators',
    value: 95,
    delta: 0,
    unit: '%',
    trend: [94, 94, 94, 95],
  },
  students: [
    { id: 1, name: 'Alice Smith', grade: 10, attendance: 98, behavior: 'Good' },
    { id: 2, name: 'Bob Johnson', grade: 11, attendance: 95, behavior: 'Fair' },
    { id: 3, name: 'Charlie Brown', grade: 12, attendance: 92, behavior: 'Poor' },
  ],
  staff: [
    { id: 1, name: 'Dr. Jane Doe', role: 'Principal', satisfaction: 90, tenure: 10 },
    { id: 2, name: 'Mr. John Smith', role: 'Teacher', satisfaction: 85, tenure: 5 },
    { id: 3, name: 'Ms. Emily White', role: 'Counselor', satisfaction: 88, tenure: 3 },
  ],
};

const SchoolPerformanceReport = () => (
  <Page title="School Performance Report">
    <Header title="School Performance Overview" subtitle="Term Report for the Board" />
    <Section title="Key Metrics">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <Card>
          <Metric label={schoolPerformanceData.studentPerformance.label} value={schoolPerformanceData.studentPerformance.value} delta={schoolPerformanceData.studentPerformance.delta} unit={schoolPerformanceData.studentPerformance.unit} />
          <Trend series={schoolPerformanceData.studentPerformance.trend} />
        </Card>
        <Card>
          <Metric label={schoolPerformanceData.staffMetrics.label} value={schoolPerformanceData.staffMetrics.value} delta={schoolPerformanceData.staffMetrics.delta} unit={schoolPerformanceData.staffMetrics.unit} />
          <Trend series={schoolPerformanceData.staffMetrics.trend} />
        </Card>
        <Card>
          <Metric label={schoolPerformanceData.financialHealth.label} value={schoolPerformanceData.financialHealth.value} delta={schoolPerformanceData.financialHealth.delta} unit={schoolPerformanceData.financialHealth.unit} />
          <Trend series={schoolPerformanceData.financialHealth.trend} />
        </Card>
        <Card>
          <Metric label={schoolPerformanceData.safetyIndicators.label} value={schoolPerformanceData.safetyIndicators.value} delta={schoolPerformanceData.safetyIndicators.delta} unit={schoolPerformanceData.safetyIndicators.unit} />
          <Trend series={schoolPerformanceData.safetyIndicators.trend} />
        </Card>
      </div>
    </Section>
    <Section title="Student Performance">
      <DataTable
        columns={['Name', 'Grade', 'Attendance', 'Behavior']}
        rows={schoolPerformanceData.students.map(student => ({
          name: student.name,
          grade: student.grade,
          attendance: student.attendance,
          behavior: student.behavior,
        }))}
      />
    </Section>
    <Section title="Staff Metrics">
      <DataTable
        columns={['Name', 'Role', 'Satisfaction', 'Tenure']}
        rows={schoolPerformanceData.staff.map(staff => ({
          name: staff.name,
          role: staff.role,
          satisfaction: staff.satisfaction,
          tenure: staff.tenure,
        }))}
      />
    </Section>
  </Page>
);

export default SchoolPerformanceReport;

import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, Comparison, Timeline, Status } from "@stoa/react";

const SchoolPerformanceDashboard = () => {
  return (
    <Page title="School Performance Overview">
      <Header title="Term Review Dashboard" subtitle="School Performance for the 2024-2025 Academic Year" />
      <Section title="Academic Performance">
        <Card title="Average Exam Scores">
          <Metric label="Overall" value="82.5" unit="%" />
          <Delta value="2.1" basis="80.4" />
          <Trend series={[78, 80, 81, 82, 82.5]} />
        </Card>
        <Card title="Subject Performance">
          <Metric label="Math" value="85.2" unit="%" />
          <Metric label="Science" value="81.7" unit="%" />
          <Metric label="Literature" value="88.9" unit="%" />
        </Card>
      </Section>
      <Section title="Student Engagement">
        <Card title="Attendance Rate">
          <Metric label="Overall" value="94.3" unit="%" />
          <Delta value="1.2" basis="93.1" />
        </Card>
        <Card title="Participation">
          <Metric label="Events" value="78" unit="%" />
          <Metric label="Clubs" value="65" unit="%" />
        </Card>
      </Section>
      <Section title="Financial Health">
        <Card title="Budget Utilization">
          <Metric label="Spent" value="$2.1M" />
          <Metric label="Remaining" value="$0.8M" />
          <Delta value="-25%" basis="100%" />
        </Card>
        <Card title="Expenditure Trends">
          <Chart type="line" series={[150, 160, 175, 180, 190]} />
        </Card>
      </Section>
      <Section title="Comparison with Regional Benchmarks">
        <Comparison
          entities={["Our School", "Regional Average"]}
          metrics={[
            { label: "Exam Scores", value: "82.5", basis: "80.4" },
            { label: "Attendance", value: "94.3", basis: "92.1" },
            { label: "Expenditure", value: "$2.1M", basis: "$2.5M" },
          ]}
        />
      </Section>
      <Section title="Key Events">
        <Timeline
          events={[
            { date: "2024-09-01", description: "New STEM Lab Opened" },
            { date: "2024-10-15", description: "Parent-Teacher Conferences" },
            { date: "2024-12-01", description: "Winter Sports Season Begins" },
          ]}
        />
      </Section>
      <Section title="Status Summary">
        <Card title="Overall Status">
          <Status tone="success" label="On Track" />
        </Card>
        <Card title="Notable Issues">
          <Status tone="warning" label="Low Staffing in Science" />
          <Status tone="error" label="Budget Overruns in Infrastructure" />
        </Card>
      </Section>
    </Page>
  );
};

export default SchoolPerformanceDashboard;

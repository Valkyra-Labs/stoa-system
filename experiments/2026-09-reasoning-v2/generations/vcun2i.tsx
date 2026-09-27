import { Page, Header, Sidebar, Section, Card, DataTable, Status, EmptyData } from "@stoa/react";

const StudentProfile = () => {
  const student = {
    id: "12345",
    name: "Alice Johnson",
    grade: "9th",
    teacher: "Ms. Smith",
  };

  const academicData = [
    { subject: "Math", grade: "B", quarter: "Q1" },
    { subject: "English", grade: "A-", quarter: "Q1" },
    { subject: "Science", grade: "C+", quarter: "Q1" },
  ];

  const attendanceData = [
    { date: "2023-10-01", status: "Present" },
    { date: "2023-10-02", status: "Absent" },
    { date: "2023-10-03", status: "Present" },
  ];

  const behaviorData = [
    { date: "2023-10-01", incident: "Late to class", severity: "Minor" },
    { date: "2023-10-02", incident: "Disruptive behavior", severity: "Major" },
    { date: "2023-10-03", incident: "No incident", severity: "None" },
  ];

  return (
    <Page title={`Student Profile: ${student.name}`}>
      <Header title={student.name} subtitle={student.grade} />
      <Section title="Overview">
        <Card title="Student Information">
          <p>Name: {student.name}</p>
          <p>Grade: {student.grade}</p>
          <p>Teacher: {student.teacher}</p>
        </Card>
      </Section>
      <Section title="Academic Performance">
        <Card title="Grades">
          <DataTable
            columns={[
              { label: "Subject", key: "subject" },
              { label: "Grade", key: "grade" },
              { label: "Quarter", key: "quarter" },
            ]}
            rows={academicData}
          />
        </Card>
      </Section>
      <Section title="Attendance">
        <Card title="Attendance Records">
          <DataTable
            columns={[
              { label: "Date", key: "date" },
              { label: "Status", key: "status" },
            ]}
            rows={attendanceData}
          />
        </Card>
      </Section>
      <Section title="Behavior">
        <Card title="Behavior Incidents">
          <DataTable
            columns={[
              { label: "Date", key: "date" },
              { label: "Incident", key: "incident" },
              { label: "Severity", key: "severity" },
            ]}
            rows={behaviorData}
          />
        </Card>
      </Section>
      <Section title="Meeting Notes">
        <Card title="Preparation Notes">
          <p>Notes for discussion with the parent.</p>
        </Card>
      </Section>
    </Page>
  );
};

export default StudentProfile;

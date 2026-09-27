import { Page, Header, Sidebar, Card, Metric, Chart, DataTable } from "@stoa/react";

export default function SchoolDashboard() {
  return (
    <Page title="School Dashboard">
      <Header title="Acme School" subtitle="Term Overview" />
      <Sidebar>
        <p>Quick Links</p>
        <nav>
          <a href="#enrollment">Enrollment</a>
          <a href="#finance">Finance</a>
          <a href="#academics">Academics</a>
        </nav>
      </Sidebar>
      <main>
        <Card title="Enrollment">
          <Metric label="Total Students" value={1234} unit="students" />
          <Metric label="New Students" value={150} delta={20} deltaBasis={130} />
          <Chart
            type="bar"
            series={[
              { id: "totalStudents", label: "Total Students", data: [{ x: "2023-09-01", y: 1200 }, { x: "2023-10-01", y: 1234 }] },
              { id: "newStudents", label: "New Students", data: [{ x: "2023-09-01", y: 130 }, { x: "2023-10-01", y: 150 }] },
            ]}
            x="date"
            y="value"
          />
        </Card>
        <Card title="Finance">
          <Metric label="Total Budget" value={5000000} unit="$" />
          <Metric label="Expenses" value={4500000} unit="$" />
          <Metric label="Remaining Budget" value={500000} unit="$" />
          <Chart
            type="line"
            series={[
              { id: "budget", label: "Total Budget", data: [{ x: "2023-09-01", y: 5000000 }, { x: "2023-10-01", y: 5000000 }] },
              { id: "expenses", label: "Expenses", data: [{ x: "2023-09-01", y: 4000000 }, { x: "2023-10-01", y: 4500000 }] },
            ]}
            x="date"
            y="value"
          />
        </Card>
        <Card title="Academics">
          <Metric label="Average GPA" value={3.2} />
          <Metric label="Graduation Rate" value={85} unit="%" />
          <DataTable
            columns={[
              { id: "subject", label: "Subject" },
              { id: "teacher", label: "Teacher" },
              { id: "students", label: "Students" },
            ]}
            rows={[
              { subject: "Math", teacher: "Ms. Johnson", students: 30 },
              { subject: "English", teacher: "Mr. Smith", students: 35 },
              { subject: "Science", teacher: "Dr. Lee", students: 32 },
            ]}
          />
        </Card>
      </main>
    </Page>
  );
}

export default function Screen() {
  return (
    <Page title="Class results">
      <Header title="Unit 3 test" />
      <div>
        <Card title="Average"><Metric label="Average" value="72%" /></Card>
        <Card title="Pass rate"><Metric label="Pass rate" value="85%" /></Card>
        <Card title="Top"><Metric label="Top score" value="98%" /></Card>
      </div>
      <Card title="Distribution"><Chart type="bar" series={[]} x="score" y="count" /></Card>
      <Card title="Students"><DataTable columns={[]} rows={[]} /></Card>
    </Page>
  );
}

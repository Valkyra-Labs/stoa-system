const Screen = () => (
  <Page title="Failed payouts">
    <SavedViews views={[]} />
    <ReviewQueue
      items={<DataTable columns={[]} rows={[]} onRowSelect={() => {}} />}
      current={<Inspector primary={<Status tone="danger" label="Rejected" />} history={<AuditLog entries={[]} />} />}
      decision={<Button label="Retry" onPress={() => {}} />}
    />
  </Page>
);
export default Screen;

// intent: review; pattern: Explorer with detail
export default function Screen() {
  return (
    <Page title="Class results">
      <Explorer
        toolbar={<FilterBar filters={[]} />}
        table={<DataTable columns={[]} rows={[]} stickyFirstColumn onRowSelect={() => {}} />}
        detail={<Inspector primary={<Delta value={-12} basis="previous test" />} />}
      />
    </Page>
  );
}

import { EmptyState, PageHeader } from "../components/ui";

export function ReviewPage() {
  return (
    <section className="space-y-6">
      <PageHeader title="Review" />
      {/* No review engine exists yet — honest empty state, one way forward. */}
      <EmptyState
        title="Nothing to review yet"
        body="Complete learning activities and practice items will appear here."
        ctaLabel="Continue learning"
        ctaTo="/"
      />
    </section>
  );
}

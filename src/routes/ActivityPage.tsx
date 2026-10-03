import { useParams } from "react-router";
import { ActivityRunner } from "../features/lesson/ActivityRunner";
import { EmptyState, PageHeader } from "../components/ui";

export function ActivityPage() {
  const { activityId } = useParams();
  if (!activityId) {
    return (
      <section className="space-y-6">
        <PageHeader title="Learn" />
        <EmptyState
          title="Activity not found"
          body="This activity isn't available."
          ctaLabel="Back to Learn"
          ctaTo="/learn"
        />
      </section>
    );
  }
  return <ActivityRunner key={activityId} activityId={activityId} />;
}

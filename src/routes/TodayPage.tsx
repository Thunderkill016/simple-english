import { useEffect, useState } from "react";
import { Link } from "react-router";
import { titleText, type ActivityRef } from "../content/course";
import { dueCards, listCards } from "../features/review/fsrs";
import { nextActivityToDo } from "../features/state/store";
import { EmptyState, PageHeader } from "../components/ui";

/** Today answers "what should I learn now?" — exactly one primary action. */
export function TodayPage() {
  const [next, setNext] = useState<ActivityRef | undefined | null>(null);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void nextActivityToDo().then((r) => {
      if (!cancelled) setNext(r ?? null);
    });
    void listCards().then((rows) => {
      if (!cancelled) setDueCount(dueCards(rows, new Date()).length);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (next === undefined) return null;
  if (next === null) {
    return (
      <section className="space-y-6">
        <PageHeader title="Today" />
        <EmptyState
          title="Lesson complete"
          body="You finished every activity in Lesson 1."
          ctaLabel="View learning path"
          ctaTo="/learn"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Today" />
      <div className="space-y-4">
        <p className="text-sm font-medium tracking-wide text-muted uppercase">
          Continue learning
        </p>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" lang="en">
            {titleText(next.activity.title)}
          </h2>
          <p className="text-sm text-muted">
            {next.lesson.title} · <span lang="en">{titleText(next.section.title)}</span>
          </p>
        </div>
        <Link to={`/learn/activity/${next.activity.id}`} className="btn btn-primary">
          Continue
        </Link>
        {dueCount > 0 ? (
          <p className="text-sm">
            <Link to="/review" className="text-primary hover:underline">
              {dueCount} {dueCount === 1 ? "item" : "items"} to review →
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { activityIndex, course, lesson, titleText, type ActivityRef } from "../content/course";
import { activityScore, type ActivityState } from "../features/state/model";
import { listActivityStates } from "../features/state/store";
import { EmptyState, PageHeader } from "../components/ui";

const TRI: Record<ActivityState["status"], string> = {
  none: "□",
  started: "◧",
  completed: "■",
};

export function LearnPage() {
  const [params] = useSearchParams();
  const [states, setStates] = useState<Map<string, ActivityState>>(new Map());

  useEffect(() => {
    let cancelled = false;
    void listActivityStates().then((rows) => {
      if (!cancelled)
        setStates(new Map(rows.map((r) => [r.activityId, r])));
    });
    return () => {
      cancelled = true;
    };
  }, [params]);

  const sections = new Map<string, ActivityRef[]>();
  for (const ref of activityIndex) {
    const list = sections.get(ref.section.id) ?? [];
    list.push(ref);
    sections.set(ref.section.id, list);
  }

  if (activityIndex.length === 0) {
    return (
      <section className="space-y-6">
        <PageHeader title="Learn" />
        <EmptyState title="Nothing to learn yet" body="No lessons are available." />
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <PageHeader title={titleText(lesson.title)} lede={titleText(course.title)} />
      {lesson.sections.map((section) => (
        <div key={section.id} className="space-y-3">
          <h2 className="text-sm font-medium tracking-wide text-muted uppercase" lang="en">
            {titleText(section.title)}
          </h2>
          <ol className="space-y-2">
            {(sections.get(section.id) ?? []).map(({ activity }) => {
              const st = states.get(activity.id);
              const status = st?.status ?? "none";
              const score =
                activity.scored && st ? activityScore(st, activity.items.length) : null;
              return (
                <li key={activity.id}>
                  <Link
                    to={`/learn/activity/${activity.id}`}
                    className="panel flex items-center gap-3 transition-colors hover:border-primary"
                  >
                    <span
                      aria-hidden="true"
                      className={`text-lg ${status === "completed" ? "text-success" : status === "started" ? "text-primary" : "text-muted"}`}
                    >
                      {TRI[status]}
                    </span>
                    <span className="min-w-0 flex-1 font-medium" lang="en">
                      {titleText(activity.title)}
                    </span>
                    {activity.scored ? (
                      <span className="text-sm text-muted">
                        {score === null ? "•" : `${score}%`}
                      </span>
                    ) : (
                      <span className="text-sm text-muted">—</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </section>
  );
}

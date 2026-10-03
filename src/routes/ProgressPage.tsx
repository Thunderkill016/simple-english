import { useEffect, useState } from "react";
import { activityIndex, titleText } from "../content/course";
import { listCards } from "../features/review/fsrs";
import { activityScore, type ActivityState } from "../features/state/model";
import { listActivityStates, listSelfReports } from "../features/state/store";
import { PageHeader } from "../components/ui";

/** Four honest channels — completion, formative score, self-report, review. */
export function ProgressPage() {
  const [states, setStates] = useState<ActivityState[]>([]);
  const [reports, setReports] = useState(0);
  const [cards, setCards] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      listActivityStates(),
      listSelfReports(),
      listCards(),
    ]).then(([a, s, c]) => {
      if (cancelled) return;
      setStates(a);
      setReports(s.length);
      setCards(c.length);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const byId = new Map(states.map((s) => [s.activityId, s]));
  const done = states.filter((s) => s.status === "completed").length;
  const scored = activityIndex.filter((r) => r.activity.scored);

  return (
    <section className="space-y-6">
      <PageHeader title="Progress" lede="What you've done — not a level or a grade" />

      <div className="space-y-2">
        <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
          Completed
        </h2>
        <p>
          <span className="text-2xl font-bold">{done}</span>{" "}
          <span className="text-muted">
            of {activityIndex.length} activities
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
          Practice scores
        </h2>
        <ul className="space-y-1">
          {scored.map(({ activity }) => {
            const st = byId.get(activity.id);
            const score = st ? activityScore(st, activity.items.length) : null;
            return (
              <li key={activity.id} className="flex items-center gap-2 text-sm">
                <span className="text-muted w-10">{score === null ? "—" : `${score}%`}</span>
                <span lang="en">{titleText(activity.title)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
          Your notes
        </h2>
        <p className="text-sm text-muted">
          {reports === 0
            ? "No self-reports yet."
            : `${reports} self-reported ${reports === 1 ? "item" : "items"} — goals and how practice felt.`}
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
          Review
        </h2>
        <p className="text-sm text-muted">
          {cards === 0
            ? "No review items yet."
            : `${cards} items scheduled for later practice.`}
        </p>
      </div>
    </section>
  );
}

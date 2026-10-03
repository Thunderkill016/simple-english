import { useEffect, useState } from "react";
import { Link } from "react-router";
import { curriculum } from "../content/curriculum";
import { getLessonProgress, type LessonProgress } from "../features/progress/progress";
import { EmptyState, PageHeader } from "../components/ui";

/** Today answers "what should I learn now?" — exactly one primary action. */
export function TodayPage() {
  const lesson = curriculum[0];
  const [progress, setProgress] = useState<LessonProgress | undefined>(undefined);

  useEffect(() => {
    if (!lesson) return;
    let cancelled = false;
    void getLessonProgress(lesson.id).then((p) => {
      if (!cancelled) setProgress(p);
    });
    return () => {
      cancelled = true;
    };
  }, [lesson]);

  if (!lesson) {
    return (
      <section className="space-y-6">
        <PageHeader title="Today" />
        <EmptyState
          title="Nothing to learn yet"
          body="No lessons are available right now."
        />
      </section>
    );
  }

  const completed = progress?.status === "completed";

  return (
    <section className="space-y-6">
      <PageHeader title="Today" />

      {completed ? (
        <div className="space-y-4">
          <div className="panel space-y-2">
            <p className="font-semibold text-success">✓ Lesson complete</p>
            <h2 className="font-semibold">{lesson.title}</h2>
            <p className="text-sm text-muted">
              You finished the available lesson.
            </p>
          </div>
          <Link to="/learn" className="btn btn-primary">
            View learning path
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium tracking-wide text-muted uppercase">
            Continue learning
          </p>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{lesson.title}</h2>
            <p className="text-muted">{lesson.summary}</p>
            <p className="text-sm text-muted capitalize">{lesson.level}</p>
          </div>
          <Link to={`/learn?lesson=${lesson.id}`} className="btn btn-primary">
            Start lesson
          </Link>
        </div>
      )}
    </section>
  );
}

import { useEffect, useState } from "react";
import { curriculum } from "../content/curriculum";
import {
  listCompletedProgress,
  type LessonProgress,
} from "../features/progress/progress";
import { EmptyState, PageHeader } from "../components/ui";

export function ProgressPage() {
  const [completed, setCompleted] = useState<LessonProgress[] | undefined>(
    undefined,
  );

  useEffect(() => {
    let cancelled = false;
    void listCompletedProgress().then((p) => {
      if (!cancelled) setCompleted(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = (completed ?? [])
    .map((p) => ({
      progress: p,
      lesson: curriculum.find((l) => l.id === p.lessonId),
    }))
    .filter((i) => i.lesson !== undefined);

  return (
    <section className="space-y-6">
      <PageHeader title="Progress" lede="Beginner" />

      {items.length === 0 && completed !== undefined ? (
        <EmptyState
          title="No completed lessons yet"
          body="Finish a lesson and it will show up here."
          ctaLabel="Start learning"
          ctaTo="/"
        />
      ) : (
        <>
          <p>
            <span className="text-2xl font-bold">{items.length}</span>{" "}
            <span className="text-muted">
              {items.length === 1 ? "lesson" : "lessons"} completed
            </span>
          </p>
          <div className="space-y-2">
            <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
              Recently completed
            </h2>
            <ul className="space-y-2">
              {items.map(({ lesson }) => (
                <li
                  key={lesson!.id}
                  className="flex items-center gap-2 font-medium"
                >
                  <span aria-hidden="true" className="text-success">
                    ✓
                  </span>
                  {lesson!.title}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { lessons } from "../content/lessons";
import { getLessonProgress, type LessonProgress } from "../features/progress/progress";

export function TodayPage() {
  // Vertical slice: exactly one lesson, one obvious next action.
  const lesson = lessons[0];
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

  if (!lesson) return null;

  const completed = progress?.status === "completed";

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Today</h1>
      <div className="card space-y-3">
        <h2 className="font-medium text-slate-600">Continue learning</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">{lesson.title}</p>
            {completed ? (
              <p className="text-sm text-emerald-700">Completed</p>
            ) : (
              <p className="text-sm text-slate-600 capitalize">{lesson.level}</p>
            )}
          </div>
          {!completed ? (
            <Link to={`/learn?lesson=${lesson.id}`} className="btn btn-primary">
              Start →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

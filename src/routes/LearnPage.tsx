import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getLesson, lessons } from "../content/lessons";
import { LessonView } from "../features/lessons/LessonView";
import { getLessonProgress, type LessonProgress } from "../features/progress/progress";

export function LearnPage() {
  const [params] = useSearchParams();
  const lessonId = params.get("lesson");
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const [progress, setProgress] = useState<LessonProgress | undefined>(undefined);

  const firstLesson = lessons[0];

  useEffect(() => {
    if (!firstLesson) return;
    let cancelled = false;
    void getLessonProgress(firstLesson.id).then((p) => {
      if (!cancelled) setProgress(p);
    });
    return () => {
      cancelled = true;
    };
  }, [firstLesson]);

  if (lesson) {
    return (
      <div className="space-y-4">
        <Link to="/learn" className="text-sm text-sky-700 hover:underline">
          ← Back to Learn
        </Link>
        <LessonView lesson={lesson} />
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Learn</h1>
      <ul className="space-y-3">
        {lessons.map((l) => {
          const completed = progress?.lessonId === l.id && progress.status === "completed";
          return (
            <li key={l.id} className="card flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{l.title}</p>
                <p className="text-sm text-slate-600 capitalize">
                  {l.level}
                  {completed ? (
                    <span className="badge ml-2 bg-emerald-100 text-emerald-800">
                      Completed
                    </span>
                  ) : null}
                </p>
              </div>
              <Link to={`/learn?lesson=${l.id}`} className="btn btn-primary">
                Start
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

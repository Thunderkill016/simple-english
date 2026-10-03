import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { curriculum, getLesson } from "../content/curriculum";
import { LessonView } from "../features/lessons/LessonView";
import {
  getLessonProgress,
  type LessonProgress,
} from "../features/progress/progress";
import { EmptyState, PageHeader } from "../components/ui";

export function LearnPage() {
  const [params] = useSearchParams();
  const lessonId = params.get("lesson");
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const [progress, setProgress] = useState<LessonProgress | undefined>(undefined);

  const firstLesson = curriculum[0];

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
    return <LessonView lesson={lesson} />;
  }

  if (lessonId) {
    return (
      <section className="space-y-6">
        <PageHeader title="Learn" />
        <EmptyState
          title="Lesson not found"
          body="This lesson isn't available."
          ctaLabel="Back to Learn"
          ctaTo="/learn"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Learn" />
      <ol className="space-y-4">
        {curriculum.map((l, i) => {
          const completed =
            progress?.lessonId === l.id && progress.status === "completed";
          const intro = l.blocks.find((b) => b.type === "text");
          return (
            <li key={l.id} className="flex gap-4">
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  completed ? "bg-success-soft text-success" : "bg-primary-soft text-primary"
                }`}
              >
                {completed ? "✓" : String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-semibold">
                  {l.title}
                  {completed ? (
                    <span className="ml-2 text-sm font-medium text-success">
                      Completed
                    </span>
                  ) : null}
                </p>
                {intro?.type === "text" ? (
                  <p className="text-sm text-muted">{intro.text}</p>
                ) : null}
                <p className="text-sm text-muted capitalize">{l.level}</p>
                <div className="pt-2">
                  <Link
                    to={`/learn?lesson=${l.id}`}
                    className={completed ? "btn btn-secondary" : "btn btn-primary"}
                  >
                    {completed ? "Practice again" : "Start"}
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

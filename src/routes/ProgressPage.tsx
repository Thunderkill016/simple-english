import { useEffect, useState } from "react";
import { countCompletedLessons } from "../features/progress/progress";

export function ProgressPage() {
  const [completed, setCompleted] = useState<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void countCompletedLessons().then((n) => {
      if (!cancelled) setCompleted(n);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Progress</h1>
      <p className="text-slate-700">
        Lessons completed: {completed ?? 0}
      </p>
    </section>
  );
}

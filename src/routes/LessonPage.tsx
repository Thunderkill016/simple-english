// Lesson stepper — one linear flow through VOA LLE Lesson 1.
// Back/Continue navigation; currentStep + results persist to localStorage
// so a refresh resumes exactly where the learner left off.
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { course, lesson, titleText } from "../content/course";
import { ItemView, type ItemResult } from "../features/lesson/ItemView";
import {
  loadProgress,
  saveProgress,
  type LessonProgress,
} from "../features/lesson/progress";
import { requiredAnswers, steps } from "../features/lesson/steps";

export function LessonPage() {
  const [progress, setProgress] = useState<LessonProgress>(() =>
    loadProgress(lesson.id),
  );

  const stepIndex = Math.min(progress.currentStep, steps.length - 1);
  const step = steps[stepIndex]!;

  const required = useMemo(() => requiredAnswers(step), [step]);
  const allAnswered = required.every((id) => progress.quiz[id] !== undefined);
  const canContinue = step.finish ? false : !step.scored || allAnswered;

  const quizItems = steps.find((s) => s.id === "quiz")!.items;
  const quizCorrect = quizItems.filter(
    (i) => progress.quiz[i.id]?.outcome === "correct",
  ).length;

  function update(next: LessonProgress) {
    setProgress(next);
    saveProgress(next);
  }

  function resolve(itemId: string, r: ItemResult) {
    const next: LessonProgress = { ...progress, quiz: { ...progress.quiz } };
    if (itemId === "prod-convo-write") {
      next.write = r.answer;
    } else {
      // first recorded outcome wins — resolved items never change
      if (!next.quiz[itemId])
        next.quiz[itemId] = {
          outcome: r.outcome === "revealed" ? "revealed" : "correct",
          attempts: r.attempts,
          answer: r.answer,
        };
    }
    update(next);
  }

  function go(delta: number) {
    const i = Math.min(Math.max(0, stepIndex + delta), steps.length - 1);
    const completedSteps = progress.completedSteps.includes(stepIndex)
      ? progress.completedSteps
      : [...progress.completedSteps, stepIndex];
    update({
      ...progress,
      currentStep: i,
      completedSteps,
      lessonCompleted: progress.lessonCompleted || i === steps.length - 1,
    });
  }

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <Link to="/" className="text-link inline-block text-sm">
          ← Exit lesson
        </Link>
        <div className="space-y-1">
          <p className="text-sm text-muted">
            {titleText(lesson.title)} · Step {stepIndex + 1} of {steps.length}
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            {step.finish ? "Finish" : step.heading}
          </h1>
        </div>
        <ol className="flex flex-wrap gap-1.5" aria-label="Steps">
          {steps.map((s, i) => (
            <li key={s.id}>
              <span
                aria-label={`Step ${i + 1}: ${s.label}${progress.completedSteps.includes(i) ? " (done)" : ""}`}
                className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                  i === stepIndex
                    ? "bg-primary text-on-primary"
                    : progress.completedSteps.includes(i)
                      ? "bg-success-soft text-success"
                      : "bg-primary-soft text-primary"
                }`}
              >
                {progress.completedSteps.includes(i) && i !== stepIndex ? "✓" : i + 1}
              </span>
            </li>
          ))}
        </ol>
      </header>

      {step.finish ? (
        <section className="panel space-y-3 border-success/30 bg-success-soft/60">
          <p className="font-semibold text-success">✓ Lesson complete</p>
          <p className="text-sm">
            Listening quiz: {quizCorrect} of {quizItems.length} correct{" "}
            <span className="text-muted">— a practice score, not a mastery mark.</span>
          </p>
          <p className="text-sm text-muted" lang="en">
            {titleText(course.title)}
          </p>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn btn-secondary" onClick={() => go(-1)}>
              Back
            </button>
            <Link to="/" className="btn btn-primary">
              Done
            </Link>
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          {step.items.map((item) => (
            <div key={item.id} className="panel space-y-4">
              <ItemView
                item={item}
                saved={progress.quiz[item.id]}
                savedText={progress.write}
                onResolve={(r) => resolve(item.id, r)}
              />
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={stepIndex === 0}
              onClick={() => go(-1)}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canContinue}
              onClick={() => go(1)}
            >
              Continue
            </button>
          </div>
        </section>
      )}
    </article>
  );
}

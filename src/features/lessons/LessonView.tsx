import { useEffect, useState } from "react";
import type { Lesson, MultipleChoiceBlock } from "../../content/lesson";
import {
  completeLesson,
  getLessonProgress,
  markLessonStarted,
  progressAfterAnswer,
  progressAfterComplete,
  saveAnswer,
  type LessonProgress,
} from "../progress/progress";
import { Block } from "./blocks";

type Feedback = "correct" | "incorrect" | null;

export function LessonView({ lesson }: { lesson: Lesson }) {
  const [progress, setProgress] = useState<LessonProgress | undefined>(undefined);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [persistError, setPersistError] = useState(false);

  const exercise = lesson.blocks.find(
    (b): b is MultipleChoiceBlock => b.type === "multiple-choice",
  );

  // Restore progress locally on open — never via network (SPEC §9).
  useEffect(() => {
    let cancelled = false;
    void getLessonProgress(lesson.id).then((existing) => {
      if (cancelled) return;
      setProgress(existing);
      void markLessonStarted(lesson.id).then((next) => {
        if (!cancelled) setProgress(next);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [lesson.id]);

  const completed = progress?.status === "completed";
  const correctSelected =
    exercise !== undefined && progress?.selectedAnswer === exercise.answer;

  function handleSelect(optionId: string) {
    if (!exercise) return;
    setFeedback(null);
    setPersistError(false);
    // UI responds immediately; persistence follows (SPEC §9).
    setProgress((prev) =>
      progressAfterAnswer(prev, lesson.id, optionId, new Date().toISOString()),
    );
    void saveAnswer(lesson.id, optionId).catch(() => setPersistError(true));
  }

  function handleCheck() {
    if (!exercise || progress?.selectedAnswer === undefined) return;
    setFeedback(correctSelected ? "correct" : "incorrect");
  }

  function handleComplete() {
    const previous = progress;
    setPersistError(false);
    // UI responds immediately; persistence follows.
    setProgress((prev) =>
      progressAfterComplete(prev, lesson.id, new Date().toISOString()),
    );
    void completeLesson(lesson.id).catch(() => {
      setPersistError(true);
      // Revert — the UI must not claim a persisted state the write never made true.
      setProgress(previous);
    });
  }

  return (
    <article className="space-y-4">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          {completed ? (
            <span className="badge bg-emerald-100 text-emerald-800">Completed</span>
          ) : null}
        </div>
        <p className="text-sm text-slate-600 capitalize">{lesson.level}</p>
      </header>

      {lesson.blocks.map((block, i) => (
        <Block
          key={block.type === "multiple-choice" ? block.id : i}
          block={block}
          selected={progress?.selectedAnswer}
          onSelect={handleSelect}
        />
      ))}

      {exercise ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {!completed ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCheck}
                disabled={progress?.selectedAnswer === undefined}
              >
                Check
              </button>
            ) : null}
            {correctSelected && !completed ? (
              <button type="button" className="btn btn-primary" onClick={handleComplete}>
                Complete lesson
              </button>
            ) : null}
          </div>
          <p role="status" aria-live="polite" className="text-sm font-medium">
            {feedback === "correct" ? (
              <span className="text-emerald-700">Correct — well done.</span>
            ) : null}
            {feedback === "incorrect" ? (
              <span className="text-amber-700">Not quite — try again.</span>
            ) : null}
            {completed ? (
              <span className="text-emerald-700">Lesson complete.</span>
            ) : null}
            {persistError ? (
              <span role="alert" className="text-amber-700">
                Couldn't save progress locally — it may not be there after reload.
              </span>
            ) : null}
          </p>
        </div>
      ) : null}

      <footer className="pt-2 text-xs text-slate-500">
        <p>
          Source:{" "}
          <a
            href={lesson.source.url}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
          >
            {lesson.source.title}
          </a>
          {" — "}
          {lesson.source.licenseUrl ? (
            <a
              href={lesson.source.licenseUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
            >
              {lesson.source.license}
            </a>
          ) : (
            lesson.source.license
          )}
          {lesson.source.adapted ? " (adapted)" : null}
          {lesson.source.synthetic ? " (synthetic fixture)" : null}
        </p>
        {lesson.source.attribution ? (
          <p className="mt-1">{lesson.source.attribution}</p>
        ) : null}
      </footer>
    </article>
  );
}

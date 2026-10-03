import { useEffect, useState } from "react";
import { Link } from "react-router";
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
import { Block, Exercise, type ExerciseFeedback } from "./blocks";
import { getSourceRecord } from "../../content/sources";

export function LessonView({ lesson }: { lesson: Lesson }) {
  const [progress, setProgress] = useState<LessonProgress | undefined>(undefined);
  const [feedback, setFeedback] = useState<ExerciseFeedback>(null);
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

  const record = getSourceRecord(lesson.source.id);
  const resolved = {
    title: lesson.source.title ?? record?.title,
    url: lesson.source.url ?? record?.url,
    license: lesson.source.license ?? record?.license,
    licenseUrl: lesson.source.licenseUrl ?? record?.licenseUrl,
    attribution:
      lesson.source.attribution ??
      (record
        ? `Based on “${record.title}” by ${record.authors.join(", ")} (${record.publisher}), ${record.license}. Adapted by Simple English.`
        : undefined),
  };

  return (
    <article className="space-y-6">
      {/* Focus header — the only chrome during a lesson is the way out. */}
      <header className="space-y-3">
        <Link to="/learn" className="text-link inline-block text-sm">
          ← Back to Learn
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
          <p className="text-sm text-muted">
            <span className="capitalize">{lesson.level}</span>
            {completed ? (
              <>
                {" · "}
                <span className="font-medium text-success">Completed ✓</span>
              </>
            ) : null}
          </p>
        </div>
      </header>

      {lesson.blocks.map((block, i) =>
        block.type === "multiple-choice" ? (
          <Exercise
            key={block.id}
            block={block}
            selected={progress?.selectedAnswer}
            feedback={feedback}
            completed={completed}
            persistError={persistError}
            onSelect={handleSelect}
            onCheck={handleCheck}
            onComplete={handleComplete}
          />
        ) : (
          <Block key={i} block={block} />
        ),
      )}

      {completed ? (
        <section className="panel space-y-3 border-success/30 bg-success-soft/60">
          <p className="font-semibold text-success">✓ Lesson complete</p>
          <p className="text-sm">You finished {lesson.title}.</p>
          <Link to="/learn" className="btn btn-primary">
            Back to Learn
          </Link>
        </section>
      ) : null}

      {/* Provenance stays intact but out of the reading flow. */}
      <details className="text-sm text-muted">
        <summary className="cursor-pointer font-medium text-ink">
          Sources &amp; license
        </summary>
        <div className="mt-3 space-y-1 border-l-2 border-border pl-4">
          <p>
            {resolved.url ? (
              <a
                href={resolved.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {resolved.title} ↗
              </a>
            ) : (
              resolved.title
            )}
          </p>
          <p>
            License:{" "}
            {resolved.licenseUrl ? (
              <a
                href={resolved.licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {resolved.license} ↗
              </a>
            ) : (
              resolved.license
            )}
            {lesson.source.adapted ? " · adapted" : null}
            {lesson.source.synthetic ? " · synthetic fixture" : null}
          </p>
          {resolved.attribution ? <p>{resolved.attribution}</p> : null}
        </div>
      </details>
    </article>
  );
}

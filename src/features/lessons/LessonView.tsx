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

  const sources = lesson.sourceRefs.map((ref) => ({
    ref,
    record: getSourceRecord(ref.sourceId),
  }));

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
          />
        ) : (
          <Block key={i} block={block} />
        ),
      )}

      {/* Completion CTA lives AFTER all content — the learner reaches it
          only past the production step, not mid-lesson. */}
      {!completed && (!exercise || feedback === "correct" || correctSelected) ? (
        <section className="panel space-y-3">
          <p className="font-semibold">
            Finished your turn? Complete the lesson.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleComplete}
          >
            Complete lesson
          </button>
          {persistError ? (
            <p role="alert" className="text-sm text-warning">
              Couldn't save progress locally — it may not be there after reload.
            </p>
          ) : null}
        </section>
      ) : null}

      {completed ? (
        <section className="panel space-y-3 border-success/30 bg-success-soft/60">
          {lesson.completion ? (
            <>
              <p className="font-semibold text-success">
                ✓ {lesson.completion.statement}
              </p>
              <ul className="space-y-1 text-sm">
                {lesson.completion.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-success">
                      ✓
                    </span>
                    {skill}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="font-semibold text-success">✓ Lesson complete</p>
              <p className="text-sm">You finished {lesson.title}.</p>
            </>
          )}
          <Link to="/learn" className="btn btn-primary">
            Back to Learn
          </Link>
        </section>
      ) : null}

      {/* Provenance stays intact but out of the reading flow — the lesson
          is SE-authored; contributing sources are credited individually. */}
      <details className="text-sm text-muted">
        <summary className="cursor-pointer font-medium text-ink">
          Sources &amp; license
        </summary>
        <div className="mt-3 space-y-3 border-l-2 border-border pl-4">
          <p>Lesson by {lesson.authoredBy}.</p>
          {sources.length > 0 ? (
            <div className="space-y-2">
              <p className="font-medium text-ink">Built using:</p>
              <ul className="space-y-2">
                {sources.map(({ ref, record }) => (
                  <li key={ref.id} className="space-y-0.5">
                    <a
                      href={ref.itemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {ref.itemTitle ?? record?.title ?? ref.id} ↗
                    </a>
                    <p>
                      {ref.role} — {record?.publisher}
                      {record ? ` · ${record.license}` : null}
                      {record?.licenseUrl ? (
                        <>
                          {" "}
                          (
                          <a
                            href={record.licenseUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            license ↗
                          </a>
                          )
                        </>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p>Explanations, exercises and translations are {lesson.authoredBy}&rsquo;s own.</p>
        </div>
      </details>
    </article>
  );
}

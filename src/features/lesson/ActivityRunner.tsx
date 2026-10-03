// Activity runner — sequential item flow with first-unresolved resume.
// One primary action, resolved work never repeats (ADR-0003 / Phase 4).
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  activityIndex,
  getActivity,
  titleText,
  type ActivityRef,
} from "../../content/course";
import type { Item } from "../../content/model";
import {
  activityScore,
  firstUnresolvedIndex,
  type ActivityState,
  type ItemOutcome,
  type ItemState,
} from "../state/model";
import {
  enterActivity,
  loadActivity,
  resolveItem,
  saveSelfReport,
} from "../state/store";
import { ItemView } from "./ItemView";

function outcomeLabel(outcome: ItemOutcome): string {
  switch (outcome) {
    case "correct":
      return "✓";
    case "revealed":
      return "•";
    default:
      return "✓";
  }
}

export function ActivityRunner({ activityId }: { activityId: string }) {
  const ref = useMemo(() => getActivity(activityId), [activityId]);
  const [aState, setAState] = useState<ActivityState>();
  const [states, setStates] = useState<Map<string, ItemState>>(new Map());
  const [pos, setPos] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [persistError, setPersistError] = useState(false);

  // Load persisted state → land on first unresolved item (or completion).
  useEffect(() => {
    let cancelled = false;
    void enterActivity(activityId)
      .then(() => loadActivity(activityId))
      .then((loaded0) => {
        if (cancelled || !loaded0) return;
        setAState(loaded0.aState);
        setStates(loaded0.states);
        setPos(Math.min(loaded0.cursor, ref!.activity.items.length - 1));
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [activityId, ref]);

  if (!ref) {
    return <p className="text-muted">This activity isn't available.</p>;
  }

  const { activity, section, lesson } = ref;
  const items = activity.items;
  const resolved = (id: string) => states.get(id) !== undefined;
  const cursor = firstUnresolvedIndex(
    items.map((i) => i.id),
    states,
  );
  const allDone = cursor >= items.length;
  const current: Item | undefined = items[pos];
  const score =
    activity.scored && aState ? activityScore(aState, items.length) : null;

  async function handleResolve(
    item: Item,
    outcome: ItemOutcome,
    attempts: number,
    selfReport?: string,
  ) {
    setPersistError(false);
    setStates((prev) => {
      const next = new Map(prev);
      next.set(item.id, {
        itemId: item.id,
        outcome,
        attempts,
        updatedAt: new Date().toISOString(),
      });
      return next;
    });
    try {
      await resolveItem(activity.id, item.id, outcome, attempts);
      if (selfReport !== undefined) await saveSelfReport(item.id, selfReport);
      const reloaded = await loadActivity(activity.id);
      if (reloaded?.aState) setAState(reloaded.aState);
    } catch {
      setPersistError(true);
    }
  }

  const nextRef: ActivityRef | undefined =
    activityIndex[ref.index + 1] ?? undefined;

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <Link to="/learn" className="text-link inline-block text-sm">
          ← Back to Learn
        </Link>
        <div className="space-y-1">
          <p className="text-sm text-muted">
            {lesson.title} · {titleText(section.title)}
          </p>
          <h1 className="text-2xl font-bold tracking-tight" lang="en">
            {titleText(activity.title)}
          </h1>
        </div>
      </header>

      {!loaded ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <>
          {/* progress dots — resolved items show outcome, never repeated */}
          <ol className="flex flex-wrap gap-1.5" aria-label="Items">
            {items.map((it, i) => {
              const st = states.get(it.id);
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => setPos(i)}
                    aria-label={`Item ${i + 1}${st ? ` (${st.outcome})` : ""}`}
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                      i === pos
                        ? "bg-primary text-on-primary"
                        : st
                          ? "bg-success-soft text-success"
                          : "bg-primary-soft text-primary"
                    }`}
                  >
                    {st ? outcomeLabel(st.outcome) : i + 1}
                  </button>
                </li>
              );
            })}
          </ol>

          {allDone ? (
            <section className="panel space-y-3 border-success/30 bg-success-soft/60">
              <p className="font-semibold text-success">✓ Activity complete</p>
              {score !== null ? (
                <p className="text-sm">
                  Score: <strong>{score}%</strong>{" "}
                  <span className="text-muted">
                    — a practice score, not a mastery mark.
                  </span>
                </p>
              ) : null}
              <div className="flex gap-3">
                {nextRef ? (
                  <Link
                    to={`/learn/activity/${nextRef.activity.id}`}
                    className="btn btn-primary"
                  >
                    Next: {titleText(nextRef.activity.title)}
                  </Link>
                ) : (
                  <Link to="/learn" className="btn btn-primary">
                    Back to Learn
                  </Link>
                )}
              </div>
            </section>
          ) : (
            current && (
              <section className="panel space-y-4" key={current.id}>
                <p className="text-sm text-muted">
                  {pos + 1} of {items.length}
                </p>
                {resolved(current.id) ? (
                  <ResolvedView item={current} state={states.get(current.id)!} />
                ) : (
                  <ItemView
                    item={current}
                    onResolve={(o, a, sr) => void handleResolve(current, o, a, sr)}
                  />
                )}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={pos === 0}
                    onClick={() => setPos((p) => Math.max(0, p - 1))}
                  >
                    Back
                  </button>
                  {resolved(current.id) || isNonAnswerable(current) ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (isNonAnswerable(current) && !resolved(current.id)) {
                          void handleResolve(current, "done", 0);
                        }
                        setPos((p) => Math.min(items.length - 1, p + 1));
                      }}
                    >
                      Next
                    </button>
                  ) : null}
                </div>
                {persistError ? (
                  <p role="alert" className="text-sm text-warning">
                    Couldn't save progress locally — it may not be there after
                    reload.
                  </p>
                ) : null}
              </section>
            )
          )}
        </>
      )}
    </article>
  );
}

/** read/media/note items resolve by progression, not by an answer */
function isNonAnswerable(item: Item): boolean {
  return item.type === "read" || item.type === "media";
}

function ResolvedView({ item, state }: { item: Item; state: ItemState }) {
  // Content items re-render read-only; answerable items show their verified
  // answer alongside the recorded outcome — never a fresh attempt.
  const answerText =
    item.type === "mc"
      ? item.options.find((o) => o.id === item.answer)?.text.text
      : item.type === "dictation" || item.type === "cloze"
        ? item.answer.text
        : undefined;
  return (
    <div className="space-y-3">
      <p className="font-medium text-success">
        {state.outcome === "correct"
          ? "✓ Correct"
          : state.outcome === "revealed"
            ? "Resolved — answer shown"
            : state.outcome === "practiced"
              ? "✓ Practiced"
              : "✓ Done"}
      </p>
      {item.type === "read" || item.type === "media" ? (
        <ItemView item={item} onResolve={() => {}} />
      ) : (
        <div className="space-y-2" lang="en">
          {"prompt" in item && item.prompt ? (
            <p className="whitespace-pre-line font-medium">{item.prompt.text}</p>
          ) : null}
          {"text" in item && item.text ? (
            <p className="whitespace-pre-line font-medium">{item.text.text}</p>
          ) : null}
          {answerText ? (
            <p className="text-sm">
              Answer: <span className="font-medium">{answerText}</span>
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

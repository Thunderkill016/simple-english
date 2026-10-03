import { useEffect, useState } from "react";
import { getItem, titleText } from "../content/course";
import type { Item } from "../content/model";
import {
  dueCards,
  listCards,
  recordReviewAttempt,
  type ReviewCardRow,
} from "../features/review/fsrs";
import { normalizeAnswer } from "../features/feedback/feedback";
import { EmptyState, PageHeader } from "../components/ui";

/** Due FSRS items — re-attempt the same source item, reschedule honestly. */
export function ReviewPage() {
  const [due, setDue] = useState<ReviewCardRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void listCards().then((rows) => {
      if (cancelled) return;
      setDue(dueCards(rows, new Date()));
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) return null;
  const current = due[pos];
  const found = current ? getItem(current.itemId) : undefined;

  return (
    <section className="space-y-6">
      <PageHeader title="Review" lede="Spaced practice from your completed items" />
      {due.length === 0 ? (
        <EmptyState
          title="Nothing due"
          body="Items you finish can come back here later for practice."
          ctaLabel="Continue learning"
          ctaTo="/"
        />
      ) : found && current ? (
        <ReviewItem
          key={current.itemId}
          item={found.item}
          sectionTitle={titleText(found.ref.section.title)}
          onDone={() => setPos((p) => p + 1)}
        />
      ) : (
        <EmptyState
          title="Nothing due"
          body="Scheduled items are up to date."
          ctaLabel="Continue learning"
          ctaTo="/"
        />
      )}
      {due.length > 0 ? (
        <p className="text-sm text-muted">
          {Math.min(pos + 1, due.length)} of {due.length}
        </p>
      ) : null}
    </section>
  );
}

function ReviewItem({
  item,
  sectionTitle,
  onDone,
}: {
  item: Item;
  sectionTitle: string;
  onDone: () => void;
}) {
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected] = useState<string>();
  const [typed, setTyped] = useState("");

  async function finish(correct: boolean) {
    await recordReviewAttempt(item.id, correct, new Date());
    setResult(correct ? "correct" : "wrong");
  }

  if (item.type === "mc") {
    return (
      <div className="panel space-y-4">
        <p className="text-sm text-muted" lang="en">{sectionTitle}</p>
        <p lang="en" className="font-semibold whitespace-pre-line">{item.prompt.text}</p>
        {item.media ? (
          item.media.kind === "audio" ? (
            <audio controls preload="none" src={item.media.src} className="w-full" />
          ) : (
            <video controls preload="metadata" src={item.media.src} className="w-full rounded-lg border border-border" />
          )
        ) : null}
        <fieldset className="space-y-2">
          {item.options.map((o) => (
            <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 ${selected === o.id ? "border-primary bg-primary-soft" : "border-border"}`}>
              <input
                type="radio"
                name={item.id}
                checked={selected === o.id}
                disabled={result !== null}
                onChange={() => setSelected(o.id)}
                className="size-4 accent-primary"
              />
              <span lang="en">{o.text.text}</span>
            </label>
          ))}
        </fieldset>
        {result === null ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={!selected}
            onClick={() => void finish(selected === item.answer)}
          >
            Check answer
          </button>
        ) : (
          <ResultLine result={result} answer={item.options.find((o) => o.id === item.answer)?.text.text ?? ""} onDone={onDone} />
        )}
      </div>
    );
  }

  if (item.type === "dictation" || item.type === "cloze") {
    const promptText = item.type === "dictation" ? item.prompt.text : item.text.text;
    const media = item.type === "dictation" ? item.media : undefined;
    return (
      <div className="panel space-y-4">
        <p className="text-sm text-muted" lang="en">{sectionTitle}</p>
        <p lang="en" className="font-semibold whitespace-pre-line">{promptText}</p>
        {media ? (
          media.kind === "audio" ? (
            <audio controls preload="none" src={media.src} className="w-full" />
          ) : (
            <video controls preload="metadata" src={media.src} className="w-full rounded-lg border border-border" />
          )
        ) : null}
        <input
          type="text"
          value={typed}
          disabled={result !== null}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Your answer"
          className="w-full rounded-lg border border-border bg-panel px-3 py-3 text-ink"
        />
        {result === null ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={typed.trim().length === 0}
            onClick={() => void finish(normalizeAnswer(typed) === normalizeAnswer(item.answer.text))}
          >
            Check answer
          </button>
        ) : (
          <ResultLine result={result} answer={item.answer.text} onDone={onDone} />
        )}
      </div>
    );
  }

  return null;
}

function ResultLine({ result, answer, onDone }: { result: "correct" | "wrong"; answer: string; onDone: () => void }) {
  return (
    <div className="space-y-3">
      {result === "correct" ? (
        <p role="status" className="font-medium text-success">✓ Correct</p>
      ) : (
        <p role="status" className="font-medium text-warning">
          Correct answer: <span lang="en">“{answer}”</span>
        </p>
      )}
      <button type="button" className="btn btn-primary" onClick={onDone}>
        Next
      </button>
    </div>
  );
}

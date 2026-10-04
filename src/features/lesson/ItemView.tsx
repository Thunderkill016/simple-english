// Per-item renderers for the lesson stepper. Item components are
// presentation + local interaction; results go up via `onResolve(result)`
// and land in localStorage progress. Items with a saved result render
// read-only — resolved work never repeats.
import { useRef, useState } from "react";
import type {
  ClozeItem,
  Field,
  Item,
  McItem,
  MediaItem,
  RecordItem,
  WriteItem,
} from "../../content/model";
import { isGapField } from "../../content/model";
import type { ItemOutcome } from "../feedback/feedback";
import { evaluate, normalizeAnswer } from "../feedback/feedback";
import { recorderSupported, startRecording } from "../recorder/recorder";

export interface ItemResult {
  outcome: ItemOutcome;
  attempts: number;
  /** recorded payload — selected option id, free text */
  answer?: string;
}

type Feedback =
  | { kind: "correct" }
  | { kind: "retry"; attemptsLeft: number }
  | { kind: "revealed"; answer: string }
  | null;

/**
 * Renders a field's text. GAP fields are withheld teacher-voice wording —
 * they render nothing at all (Task 007: omit, don't block).
 */
function FieldText({ field, className }: { field: Field; className?: string }) {
  if (isGapField(field)) return null;
  return (
    <p lang="en" className={`${className ?? "text-lesson"} whitespace-pre-line`}>
      {field.text}
    </p>
  );
}

function MediaBlock({ item }: { item: MediaItem }) {
  const [loadEmbed, setLoadEmbed] = useState(false);
  const m = item.media;
  return (
    <div className="space-y-3">
      <h3 className="font-semibold" lang="en">
        {item.title.text}
      </h3>
      {m.kind === "embed" ? (
        loadEmbed ? (
          <iframe
            title={item.title.text}
            src={m.embedSrc}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            allow="fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            className="aspect-video w-full rounded-lg border border-border"
          />
        ) : (
          <div className="space-y-2">
            <button type="button" className="btn btn-secondary" onClick={() => setLoadEmbed(true)}>
              Watch video
            </button>
            <p className="text-sm text-muted">
              Online video ·{" "}
              <a href={m.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Open original ↗
              </a>
            </p>
          </div>
        )
      ) : m.kind === "video" ? (
        <video controls preload="metadata" src={m.src} className="w-full rounded-lg border border-border" />
      ) : (
        <audio controls preload="none" src={m.src} className="w-full" aria-label={item.title.text} />
      )}
      {item.transcript ? <FieldText field={item.transcript} /> : null}
    </div>
  );
}

function ReadBlock({ blocks }: { blocks: Field[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => (
        <FieldText key={i} field={b} />
      ))}
    </div>
  );
}

function Answerable({
  prompt,
  mediaSrc,
  mediaKind,
  children,
  feedback,
  onCheck,
  canCheck,
}: {
  prompt: string;
  mediaSrc?: string;
  mediaKind?: "video" | "audio";
  children: React.ReactNode;
  feedback: Feedback;
  onCheck: () => void;
  canCheck: boolean;
}) {
  return (
    <div className="space-y-4">
      <p lang="en" className="font-semibold whitespace-pre-line">{prompt}</p>
      {mediaSrc ? (
        mediaKind === "audio" ? (
          <audio controls preload="none" src={mediaSrc} className="w-full" />
        ) : (
          <video controls preload="metadata" src={mediaSrc} className="w-full rounded-lg border border-border" />
        )
      ) : null}
      {children}
      {feedback === null || feedback.kind === "retry" ? (
        <button type="button" className="btn btn-primary" onClick={onCheck} disabled={!canCheck}>
          Check answer
        </button>
      ) : null}
      {feedback?.kind === "correct" ? (
        <p role="status" className="font-medium text-success">✓ Correct</p>
      ) : null}
      {feedback?.kind === "retry" ? (
        <p role="status" className="font-medium text-warning">
          Incorrect. Try again.
        </p>
      ) : null}
      {feedback?.kind === "revealed" ? (
        <p role="status" className="font-medium text-warning">
          See the correct answer: <span lang="en" className="text-ink">“{feedback.answer}”</span>
        </p>
      ) : null}
    </div>
  );
}

function McView({
  item,
  saved,
  onResolve,
}: {
  item: McItem;
  saved?: ItemResult;
  onResolve: (r: ItemResult) => void;
}) {
  const [selected, setSelected] = useState<string | undefined>(saved?.answer);
  const [attempts, setAttempts] = useState(saved?.attempts ?? 0);
  const initial: Feedback =
    saved?.outcome === "correct"
      ? { kind: "correct" }
      : saved?.outcome === "revealed"
        ? { kind: "revealed", answer: item.options.find((o) => o.id === item.answer)?.text.text ?? "" }
        : null;
  const [feedback, setFeedback] = useState<Feedback>(initial);
  const resolved = feedback?.kind === "correct" || feedback?.kind === "revealed";

  function check() {
    if (!selected || resolved) return;
    const { state, event } = evaluate(
      { attempts, resolved: undefined },
      selected === item.answer,
      item.attempts,
      item.options.find((o) => o.id === item.answer)?.text.text ?? "",
    );
    setAttempts(state.attempts);
    setFeedback(event);
    if (state.resolved)
      onResolve({ outcome: state.resolved, attempts: state.attempts, answer: selected });
  }

  return (
    <Answerable
      prompt={item.prompt.text}
      mediaSrc={item.media?.src}
      mediaKind={item.media?.kind}
      feedback={feedback}
      onCheck={check}
      canCheck={selected !== undefined && !resolved}
    >
      <fieldset className="space-y-2">
        {item.options.map((o) => (
          <label
            key={o.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 ${
              selected === o.id
                ? feedback?.kind === "retry"
                  ? "border-warning bg-warning-soft"
                  : feedback?.kind === "correct" && o.id === item.answer
                    ? "border-success bg-success-soft"
                    : "border-primary bg-primary-soft"
                : feedback?.kind === "revealed" && o.id === item.answer
                  ? "border-success bg-success-soft"
                  : "border-border"
            }`}
          >
            <input
              type="radio"
              name={item.id}
              value={o.id}
              checked={selected === o.id}
              disabled={resolved}
              onChange={() => setSelected(o.id)}
              className="size-4 accent-primary"
            />
            <span lang="en">{o.text.text}</span>
          </label>
        ))}
      </fieldset>
    </Answerable>
  );
}

function ClozeView({
  item,
  saved,
  onResolve,
}: {
  item: ClozeItem;
  saved?: ItemResult;
  onResolve: (r: ItemResult) => void;
}) {
  const [value, setValue] = useState(saved?.answer ?? "");
  const [attempts, setAttempts] = useState(saved?.attempts ?? 0);
  const initial: Feedback =
    saved?.outcome === "correct"
      ? { kind: "correct" }
      : saved?.outcome === "revealed"
        ? { kind: "revealed", answer: item.answer.text }
        : null;
  const [feedback, setFeedback] = useState<Feedback>(initial);
  const resolved = feedback?.kind === "correct" || feedback?.kind === "revealed";

  function check() {
    if (!value.trim() || resolved) return;
    const { state, event } = evaluate(
      { attempts, resolved: undefined },
      normalizeAnswer(value) === normalizeAnswer(item.answer.text),
      item.attempts,
      item.answer.text,
    );
    setAttempts(state.attempts);
    setFeedback(event);
    if (state.resolved)
      onResolve({ outcome: state.resolved, attempts: state.attempts, answer: value });
  }

  return (
    <Answerable
      prompt={item.text.text}
      feedback={feedback}
      onCheck={check}
      canCheck={value.trim().length > 0 && !resolved}
    >
      <input
        type="text"
        value={value}
        disabled={resolved}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
        placeholder="Your answer"
        className="w-full rounded-lg border border-border bg-panel px-3 py-3 text-ink"
      />
    </Answerable>
  );
}

function RecordView({ item, onResolve }: { item: RecordItem; onResolve: (r: ItemResult) => void }) {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState<string>();
  const [micState, setMicState] = useState<"idle" | "denied">("idle");
  const finishRef = useRef<(() => Promise<{ url: string }>) | null>(null);
  const supported = recorderSupported();

  async function toggle() {
    if (!recording) {
      try {
        const { finish } = await startRecording();
        finishRef.current = finish;
        setRecording(true);
      } catch {
        setMicState("denied");
      }
    } else {
      const rec = await finishRef.current?.();
      setRecording(false);
      if (rec) setUrl(rec.url);
    }
  }

  return (
    <div className="space-y-4">
      <FieldText field={item.prompt} className="font-semibold" />
      {item.model ? <FieldText field={item.model} /> : null}
      {item.mediaModel ? (
        <video controls preload="metadata" src={item.mediaModel.src} className="w-full rounded-lg border border-border" />
      ) : null}
      {supported && micState === "idle" ? (
        <div className="flex items-center gap-3">
          <button type="button" className="btn btn-secondary" onClick={toggle}>
            {recording ? "Stop" : url ? "Re-record" : "Record"}
          </button>
          {url ? <audio controls src={url} className="flex-1" /> : null}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Recording is unavailable here — practice aloud along with the model.
        </p>
      )}
      <button type="button" className="btn btn-secondary" onClick={() => onResolve({ outcome: "practiced", attempts: 0 })}>
        {url ? "Practiced" : "Mark as practiced"}
      </button>
    </div>
  );
}

function WriteView({
  item,
  savedText,
  onResolve,
}: {
  item: WriteItem;
  savedText?: string;
  onResolve: (r: ItemResult) => void;
}) {
  const [value, setValue] = useState(savedText ?? "");
  return (
    <div className="space-y-4">
      <FieldText field={item.prompt} className="font-semibold" />
      {item.model ? <FieldText field={item.model} /> : null}
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onResolve({ outcome: "done", attempts: 0, answer: e.target.value });
        }}
        rows={6}
        placeholder="Write here"
        className="w-full rounded-lg border border-border bg-panel px-3 py-3 text-ink"
      />
    </div>
  );
}

export function ItemView({
  item,
  saved,
  savedText,
  onResolve,
}: {
  item: Item;
  saved?: ItemResult;
  savedText?: string;
  onResolve: (r: ItemResult) => void;
}) {
  switch (item.type) {
    case "read":
      return <ReadBlock blocks={item.blocks} />;
    case "media":
      return <MediaBlock item={item} />;
    case "mc":
      return <McView item={item} saved={saved} onResolve={onResolve} />;
    case "cloze":
      return <ClozeView item={item} saved={saved} onResolve={onResolve} />;
    case "record":
      return <RecordView item={item} onResolve={onResolve} />;
    case "write":
      return <WriteView item={item} savedText={savedText} onResolve={onResolve} />;
    default:
      return null;
  }
}

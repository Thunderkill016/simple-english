// Per-item renderers for the activity runner. Item components are
// presentation + local interaction only; resolution goes through
// `onResolve(outcome, attempts)` → the four-channel store.
import { useRef, useState } from "react";
import type {
  ClozeItem,
  DictationItem,
  Field,
  Item,
  McItem,
  MediaItem,
  NoteItem,
  RecordItem,
  SelfEvalItem,
  WriteItem,
} from "../../content/model";
import { isGapField } from "../../content/model";
import type { ItemOutcome } from "../state/model";
import { evaluate, normalizeAnswer } from "../feedback/feedback";
import { recorderSupported, startRecording } from "../recorder/recorder";

type Feedback =
  | { kind: "correct" }
  | { kind: "retry"; attemptsLeft: number }
  | { kind: "revealed"; answer: string }
  | null;

// UI chrome — not instructional content, no provenance required.
const SELF_EVAL_OPTIONS = [
  { id: "practiced", label: "I practiced this" },
  { id: "confident", label: "I can do this with confidence" },
  { id: "needs", label: "Needs more practice" },
];

/** renders a field's text, or nothing instructional when the field is a GAP */
function FieldText({ field, className }: { field: Field; className?: string }) {
  if (isGapField(field)) {
    return (
      <p className={className ?? "text-lesson"} data-gap={field.prov.ref}>
        <span className="text-muted">Wording awaiting editor approval.</span>
      </p>
    );
  }
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

function McView({ item, onResolve }: { item: McItem; onResolve: (o: ItemOutcome, a: number) => void }) {
  const [selected, setSelected] = useState<string>();
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
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
    if (state.resolved) onResolve(state.resolved, state.attempts);
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

function TextEntry({
  item,
  answerText,
  displayText,
  onResolve,
}: {
  item: DictationItem | ClozeItem;
  answerText: string;
  displayText: string;
  onResolve: (o: ItemOutcome, a: number) => void;
}) {
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const resolved = feedback?.kind === "correct" || feedback?.kind === "revealed";
  const media = item.type === "dictation" ? item.media : undefined;

  function check() {
    if (!value.trim() || resolved) return;
    const { state, event } = evaluate(
      { attempts, resolved: undefined },
      normalizeAnswer(value) === normalizeAnswer(answerText),
      item.attempts,
      answerText,
    );
    setAttempts(state.attempts);
    setFeedback(event);
    if (state.resolved) onResolve(state.resolved, state.attempts);
  }

  return (
    <Answerable
      prompt={displayText}
      mediaSrc={media?.src}
      mediaKind={media?.kind}
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

function RecordView({ item, onResolve }: { item: RecordItem; onResolve: (o: ItemOutcome, a: number) => void }) {
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
      <button type="button" className="btn btn-primary" onClick={() => onResolve("practiced", 0)}>
        {url || !supported || micState === "denied" ? "I practiced — continue" : "Continue"}
      </button>
    </div>
  );
}

function WriteView({ item, onResolve }: { item: WriteItem; onResolve: (o: ItemOutcome, a: number, selfReport?: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="space-y-4">
      <FieldText field={item.prompt} className="font-semibold" />
      {item.model ? <FieldText field={item.model} /> : null}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={6}
        placeholder="Write here"
        className="w-full rounded-lg border border-border bg-panel px-3 py-3 text-ink"
      />
      <button
        type="button"
        className="btn btn-primary"
        disabled={value.trim().length === 0}
        onClick={() => onResolve("done", 0, value)}
      >
        Done — continue
      </button>
    </div>
  );
}

function NoteView({ item, onResolve }: { item: NoteItem; onResolve: (o: ItemOutcome, a: number, selfReport?: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="space-y-4">
      <FieldText field={item.prompt} className="font-semibold" />
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder="Write here"
        className="w-full rounded-lg border border-border bg-panel px-3 py-3 text-ink"
      />
      <button
        type="button"
        className="btn btn-primary"
        disabled={value.trim().length === 0}
        onClick={() => onResolve("done", 0, value)}
      >
        Save — continue
      </button>
    </div>
  );
}

function SelfEvalView({ item, onResolve }: { item: SelfEvalItem; onResolve: (o: ItemOutcome, a: number, selfReport?: string) => void }) {
  const [picked, setPicked] = useState<string>();
  return (
    <div className="space-y-3">
      <FieldText field={item.statement} className="font-semibold" />
      <div className="space-y-2">
        {SELF_EVAL_OPTIONS.map((o) => (
          <label
            key={o.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 ${picked === o.id ? "border-primary bg-primary-soft" : "border-border"}`}
          >
            <input
              type="radio"
              name={item.id}
              checked={picked === o.id}
              onChange={() => {
                setPicked(o.id);
                onResolve("done", 0, o.id);
              }}
              className="size-4 accent-primary"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function ItemView({
  item,
  onResolve,
}: {
  item: Item;
  onResolve: (outcome: ItemOutcome, attempts: number, selfReport?: string) => void;
}) {
  switch (item.type) {
    case "read":
      return <ReadBlock blocks={item.blocks} />;
    case "media":
      return <MediaBlock item={item} />;
    case "mc":
      return <McView item={item} onResolve={onResolve} />;
    case "dictation":
      return <TextEntry item={item} answerText={item.answer.text} displayText={item.prompt.text} onResolve={onResolve} />;
    case "cloze":
      return <TextEntry item={item} answerText={item.answer.text} displayText={item.text.text} onResolve={onResolve} />;
    case "record":
      return <RecordView item={item} onResolve={onResolve} />;
    case "write":
      return <WriteView item={item} onResolve={onResolve} />;
    case "note":
      return <NoteView item={item} onResolve={onResolve} />;
    case "selfeval":
      return <SelfEvalView item={item} onResolve={onResolve} />;
  }
}

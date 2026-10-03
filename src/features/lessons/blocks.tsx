import { useState } from "react";
import type {
  AudioBlock,
  ExampleBlock,
  ExternalEmbedBlock,
  HeadingBlock,
  LessonBlock,
  MultipleChoiceBlock,
  TextBlock,
} from "../../content/lesson";

function Heading({ block }: { block: HeadingBlock }) {
  return <h2 className="pt-4 text-xl font-semibold">{block.text}</h2>;
}

function Text({ block }: { block: TextBlock }) {
  return <p className="text-lesson">{block.text}</p>;
}

/** Dialogue/example — English is primary, Vietnamese is secondary support. */
function Example({ block }: { block: ExampleBlock }) {
  return (
    <figure className="rounded-r-xl border-l-2 border-primary bg-primary-soft/50 px-4 py-3">
      <p lang="en" className="font-medium whitespace-pre-line">
        {block.text}
      </p>
      {block.translation ? (
        <figcaption
          lang="vi"
          className="mt-2 text-sm text-muted whitespace-pre-line"
        >
          {block.translation}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Least-privilege iframe attributes per provider — only what the embed
// actually needs to function.
const EMBED_IFRAME_ATTRS: Record<
  ExternalEmbedBlock["provider"],
  { sandbox: string; allow?: string }
> = {
  youtube: {
    sandbox: "allow-scripts allow-same-origin allow-presentation allow-popups",
    allow: "fullscreen; picture-in-picture",
  },
};

const PROVIDER_LABEL: Record<ExternalEmbedBlock["provider"], string> = {
  youtube: "YouTube",
};

/**
 * Listening — a local, rights-verified audio asset on native controls.
 * The full transcript keeps the lesson usable when audio can't play.
 */
function Audio({ block }: { block: AudioBlock }) {
  return (
    <section className="panel space-y-3" aria-label={block.title}>
      <h2 className="font-semibold">{block.title}</h2>
      <audio
        controls
        preload="none"
        src={block.src}
        aria-label={block.title}
        className="w-full"
      />
      <p className="text-lesson whitespace-pre-line">{block.transcript}</p>
    </section>
  );
}

function ExternalEmbed({ block }: { block: ExternalEmbedBlock }) {
  const [loaded, setLoaded] = useState(false);
  const provider = PROVIDER_LABEL[block.provider];

  return (
    <section className="panel space-y-3" aria-label={block.title}>
      <div className="space-y-1">
        <h2 className="font-semibold">{block.title}</h2>
        <p className="text-sm text-muted">{block.purpose}</p>
      </div>
      {loaded ? (
        <iframe
          title={block.title}
          src={block.src}
          loading="lazy"
          sandbox={EMBED_IFRAME_ATTRS[block.provider].sandbox}
          allow={EMBED_IFRAME_ATTRS[block.provider].allow}
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video w-full rounded-lg border border-border"
        />
      ) : (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setLoaded(true)}
        >
          Watch video
        </button>
      )}
      <p className="text-sm text-muted">
        Video from {provider} · Requires internet ·{" "}
        {/* Persistent fallback — the embed is optional infrastructure, never a
            dependency. If it fails, the learner always has the original link. */}
        <a
          href={block.fallbackUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          Open original ↗
        </a>
      </p>
    </section>
  );
}

export type ExerciseFeedback = "correct" | "incorrect" | null;

/**
 * Visual state of one option. Learning feedback must never be ambiguous:
 * a wrong selection reads as warning, a correct one as success — never as
 * the same neutral green as an unchecked selection.
 */
export function optionState(
  isSelected: boolean,
  feedback: ExerciseFeedback,
  completed: boolean,
): "neutral" | "selected" | "incorrect" | "correct" {
  if (!isSelected) return "neutral";
  if (feedback === "incorrect") return "incorrect";
  if (feedback === "correct" || completed) return "correct";
  return "selected";
}

const OPTION_CLASSES: Record<ReturnType<typeof optionState>, string> = {
  neutral: "border-border",
  selected: "border-primary bg-primary-soft",
  incorrect: "border-warning bg-warning-soft",
  correct: "border-success bg-success-soft",
};

/**
 * The exercise is ONE interaction surface: prompt, choices, check action
 * and feedback belong together — feedback/completion stay separate.
 */
export function Exercise({
  block,
  selected,
  feedback,
  completed,
  persistError,
  onSelect,
  onCheck,
  onComplete,
}: {
  block: MultipleChoiceBlock;
  selected: string | undefined;
  feedback: ExerciseFeedback;
  completed: boolean;
  persistError: boolean;
  onSelect: (optionId: string) => void;
  onCheck: () => void;
  onComplete: () => void;
}) {
  const selectedText = block.options.find((o) => o.id === selected)?.text;

  return (
    <section className="panel space-y-4" aria-label="Exercise">
      <fieldset className="space-y-3">
        <legend className="px-0 font-semibold">{block.prompt}</legend>
        <div className="space-y-2">
          {block.options.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 transition-colors ${OPTION_CLASSES[optionState(selected === option.id, feedback, completed)]}`}
            >
              <input
                type="radio"
                name={block.id}
                value={option.id}
                checked={selected === option.id}
                onChange={() => onSelect(option.id)}
                className="size-4 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {!completed ? (
        <div className="flex items-center gap-3">
          {feedback === "correct" ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onComplete}
            >
              Complete lesson
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onCheck}
              disabled={selected === undefined}
            >
              Check answer
            </button>
          )}
        </div>
      ) : null}

      {/* Exercise feedback — announced politely, visually separate from the
          completion panel below. */}
      {feedback === "correct" && !completed ? (
        <p role="status" className="font-medium text-success">
          ✓ Correct{selectedText ? ` — “${selectedText}”` : ""}
        </p>
      ) : null}
      {feedback === "incorrect" ? (
        <p role="status" className="font-medium text-warning">
          Not quite — try again.
        </p>
      ) : null}
      {persistError ? (
        <p role="alert" className="text-sm text-warning">
          Couldn't save progress locally — it may not be there after reload.
        </p>
      ) : null}
    </section>
  );
}

export function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading":
      return <Heading block={block} />;
    case "text":
      return <Text block={block} />;
    case "example":
      return <Example block={block} />;
    case "audio":
      return <Audio block={block} />;
    case "external-embed":
      return <ExternalEmbed block={block} />;
    case "multiple-choice":
      // Rendered by LessonView via Exercise — needs live state the generic
      // block renderer doesn't carry.
      return null;
  }
}

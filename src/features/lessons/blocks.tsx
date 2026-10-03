import { useState } from "react";
import type {
  ExampleBlock,
  ExternalEmbedBlock,
  HeadingBlock,
  LessonBlock,
  MultipleChoiceBlock,
  TextBlock,
} from "../../content/lesson";

function Heading({ block }: { block: HeadingBlock }) {
  return <h2 className="text-lg font-semibold">{block.text}</h2>;
}

function Text({ block }: { block: TextBlock }) {
  return <p className="leading-relaxed">{block.text}</p>;
}

function Example({ block }: { block: ExampleBlock }) {
  return (
    <figure className="card border-l-4 border-l-sky-600">
      <p lang="en" className="font-medium whitespace-pre-line">
        {block.text}
      </p>
      {block.translation ? (
        <figcaption lang="vi" className="mt-1 text-sm text-slate-600 whitespace-pre-line">
          {block.translation}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function MultipleChoice({
  block,
  selected,
  onSelect,
}: {
  block: MultipleChoiceBlock;
  selected: string | undefined;
  onSelect: (optionId: string) => void;
}) {
  return (
    <fieldset className="card space-y-3">
      <legend className="px-1 font-medium">{block.prompt}</legend>
      <div className="space-y-2">
        {block.options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 has-checked:border-sky-600 has-checked:bg-sky-50"
          >
            <input
              type="radio"
              name={block.id}
              value={option.id}
              checked={selected === option.id}
              onChange={() => onSelect(option.id)}
              className="size-4 accent-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            />
            <span>{option.text}</span>
          </label>
        ))}
      </div>
    </fieldset>
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

function ExternalEmbed({ block }: { block: ExternalEmbedBlock }) {
  const [loaded, setLoaded] = useState(false);
  const host = new URL(block.src).hostname;

  return (
    <section className="card space-y-3" aria-label={block.title}>
      <div>
        <h2 className="font-medium">{block.title}</h2>
        <p className="text-sm text-slate-600">{block.purpose}</p>
      </div>
      {loaded ? (
        <iframe
          title={block.title}
          src={block.src}
          loading="lazy"
          sandbox={EMBED_IFRAME_ATTRS[block.provider].sandbox}
          allow={EMBED_IFRAME_ATTRS[block.provider].allow}
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video w-full rounded-lg border border-slate-200"
        />
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-slate-500">
            Loads content from {host} — external service, works only online.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setLoaded(true)}
          >
            Load {block.provider === "youtube" ? "video" : "activity"}
          </button>
        </div>
      )}
      {/* Persistent fallback — the embed is optional infrastructure, never a
          dependency. If it fails, the learner always has the original link. */}
      <a
        href={block.fallbackUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-block text-sm text-sky-700 hover:underline"
      >
        Open original ↗
      </a>
    </section>
  );
}

export function Block({
  block,
  selected,
  onSelect,
}: {
  block: LessonBlock;
  selected: string | undefined;
  onSelect: (optionId: string) => void;
}) {
  switch (block.type) {
    case "heading":
      return <Heading block={block} />;
    case "text":
      return <Text block={block} />;
    case "example":
      return <Example block={block} />;
    case "multiple-choice":
      return <MultipleChoice block={block} selected={selected} onSelect={onSelect} />;
    case "external-embed":
      return <ExternalEmbed block={block} />;
  }
}

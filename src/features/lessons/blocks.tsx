import type {
  ExampleBlock,
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
  }
}

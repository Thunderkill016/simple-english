import courseJson from "./lessons/voa-lle1.lesson1.lesson.json";
import sourcePackJson from "./sourcepacks/voa-lle1-lesson1.sourcepack.json";
import type {
  Activity,
  Course,
  Field,
  Item,
  Lesson,
  Section,
  SourcePack,
} from "./model";

// Static versioned content — schema + Human Content Gate validated at
// build/test time (scripts/validate-content.mjs). The client trusts the
// pipeline and pays no runtime validation cost (ADR-0002/0003).

export const course = courseJson as unknown as Course;
export const sourcePack = sourcePackJson as SourcePack;

export function titleText(t: Field | string): string {
  return typeof t === "string" ? t : t.text;
}

export interface ActivityRef {
  lesson: Lesson;
  section: Section;
  activity: Activity;
  /** flat index across the whole course — defines the linear order */
  index: number;
}

const index: ActivityRef[] = [];
for (const unit of course.units)
  for (const lesson of unit.lessons)
    for (const section of lesson.sections)
      for (const activity of section.activities)
        index.push({ lesson, section, activity, index: index.length });

export const activityIndex: readonly ActivityRef[] = index;

export function getActivity(id: string): ActivityRef | undefined {
  return index.find((r) => r.activity.id === id);
}

export function getItem(itemId: string): { ref: ActivityRef; item: Item } | undefined {
  for (const ref of index) {
    const item = ref.activity.items.find((i) => i.id === itemId);
    if (item) return { ref, item };
  }
  return undefined;
}

export const lesson: Lesson = index[0]!.lesson;

/** item types that produce a verifiable outcome (scoreable/reviewable) */
export const ANSWERABLE = new Set(["mc", "dictation", "cloze"]);

export function isAnswerable(item: Item): boolean {
  return ANSWERABLE.has(item.type);
}

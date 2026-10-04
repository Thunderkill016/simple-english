// Lesson step list — the linear learner flow for VOA LLE Lesson 1.
// Steps merge source activities by id; all instructional content still
// lives in the lesson JSON (this file only decides order/grouping).

import { getActivity, titleText } from "../../content/course";
import type { Item } from "../../content/model";

export interface LessonStep {
  id: string;
  /** UI chrome step label */
  label: string;
  /** activity title rendered as the step heading (provenanced text) */
  heading: string;
  /** flattened items of all merged activities */
  items: Item[];
  /** a step is "scored" when its answerable items must all resolve before Continue */
  scored: boolean;
  finish?: boolean;
}

const PLAN: Array<{
  id: string;
  label: string;
  activities: string[];
  scored?: boolean;
  finish?: boolean;
}> = [
  { id: "welcome", label: "Welcome", activities: ["orient-goals"] },
  { id: "key-words", label: "Key Words", activities: ["prepare-key-words"] },
  { id: "watch", label: "Watch", activities: ["input-main-video"] },
  { id: "conversation", label: "Conversation", activities: ["input-conversation"] },
  { id: "quiz", label: "Listening Quiz", activities: ["comp-quiz"], scored: true },
  {
    id: "verb-be",
    label: "Verb BE",
    activities: ["focus-notice-be", "practice-cloze"],
    scored: true,
  },
  {
    id: "pronunciation",
    label: "Pronunciation",
    activities: ["focus-pronunciation"],
  },
  {
    id: "alphabet-numbers",
    label: "Alphabet & Numbers",
    activities: ["prepare-letters-numbers"],
  },
  {
    id: "speaking",
    label: "Speaking Practice",
    activities: ["prepare-speaking-practice", "production-say"],
  },
  { id: "writing", label: "Writing", activities: ["production-write"] },
  { id: "finish", label: "Finish", activities: [], finish: true },
];

export const steps: LessonStep[] = PLAN.map((p) => {
  const refs = p.activities.map((id) => {
    const ref = getActivity(id);
    if (!ref) throw new Error(`step ${p.id}: unknown activity '${id}'`);
    return ref;
  });
  return {
    id: p.id,
    label: p.label,
    heading: refs[0] ? titleText(refs[0].activity.title) : p.label,
    items: refs.flatMap((r) => r.activity.items),
    scored: p.scored ?? false,
    finish: p.finish,
  };
});

export const ANSWERABLE = new Set(["mc", "dictation", "cloze"]);

/** ids of answerable items in a step — all must resolve before Continue */
export function requiredAnswers(step: LessonStep): string[] {
  return step.items.filter((i) => ANSWERABLE.has(i.type)).map((i) => i.id);
}

// Lesson progress — one localStorage record for VOA LLE Lesson 1.
// Deliberately flat: lessonId, currentStep, completedSteps, quiz
// answers/results, lessonCompleted. No channels, no scheduler.

export interface QuizEntry {
  outcome: "correct" | "revealed";
  attempts: number;
  /** the learner's final selection/answer where meaningful */
  answer?: string;
}

export interface LessonProgress {
  lessonId: string;
  /** index into the step list (0-based) */
  currentStep: number;
  completedSteps: number[];
  /** item id → result, for answerable items (quiz, cloze) */
  quiz: Record<string, QuizEntry>;
  /** learner's saved writing draft */
  write?: string;
  lessonCompleted: boolean;
}

const KEY = "se:lesson:voa-lle1:progress";

export function loadProgress(lessonId: string): LessonProgress {
  const empty: LessonProgress = {
    lessonId,
    currentStep: 0,
    completedSteps: [],
    quiz: {},
    lessonCompleted: false,
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<LessonProgress>;
    if (parsed.lessonId !== lessonId) return empty;
    return { ...empty, ...parsed, lessonId };
  } catch {
    return empty;
  }
}

export function saveProgress(p: LessonProgress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // storage full/blocked — the lesson still works in-session
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

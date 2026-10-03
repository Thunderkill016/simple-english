import Dexie, { type Table } from "dexie";
import type {
  ActivityState,
  ItemState,
  SelfReport,
} from "../features/state/model";
import type { ReviewCardRow } from "../features/review/fsrs";

/**
 * Canonical local learner store (ADR-0002/0003).
 * IndexedDB via Dexie — learner state lives here, never on the network path.
 *
 * v2 migration: the v1 `lessonProgress` table is dropped — it belonged to
 * the retired se-authored lesson model and must not corrupt the pilot's
 * four-channel state (Task 006, LEGACY CLEANUP).
 */
export class SEDatabase extends Dexie {
  itemStates!: Table<ItemState, string>;
  activityStates!: Table<ActivityState, string>;
  selfReports!: Table<SelfReport, string>;
  reviewCards!: Table<ReviewCardRow, string>;

  constructor() {
    super("simple-english");
    this.version(1).stores({
      lessonProgress: "lessonId, status",
    });
    this.version(2).stores({
      lessonProgress: null,
      itemStates: "itemId, outcome",
      activityStates: "activityId, status",
      selfReports: "id",
      reviewCards: "itemId, due",
    });
  }
}

export const db = new SEDatabase();

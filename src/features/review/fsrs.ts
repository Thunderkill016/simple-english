// FSRS adapter (ADR-0003) — ts-fsrs is ONLY a scheduler.
// It must never determine curriculum order, lesson completion, capability,
// CEFR level, proficiency, or speaking ability.
//
// Eligibility: only source-backed answerable items (mc/dictation/cloze)
// may become reviewable — their deterministic retrieval representation is
// the item itself. Non-answerable items are never scheduled.

import {
  createEmptyCard,
  FSRS,
  generatorParameters,
  Rating,
  type Card,
  type Grade,
} from "ts-fsrs";
import type { ItemOutcome } from "../state/model";
import { db } from "../../db/db";

const fsrs = new FSRS(
  generatorParameters({ enable_fuzz: false, enable_short_term: false }),
);

/** serialized FSRS card row — dates as ISO strings for IndexedDB */
export interface ReviewCardRow {
  itemId: string;
  card: string; // JSON-serialized ts-fsrs Card
  due: string; // ISO — indexed
  updatedAt: string;
}

function serialize(card: Card): string {
  return JSON.stringify(card, (_k, v) => (v instanceof Date ? v.toISOString() : v));
}

function deserialize(raw: string): Card {
  const c = JSON.parse(raw);
  c.due = new Date(c.due);
  if (c.last_review) c.last_review = new Date(c.last_review);
  return c;
}

/** outcome → rating: first-try correct = Good, retried = Hard, revealed = Again */
export function ratingFromOutcome(outcome: ItemOutcome, attempts: number): Rating {
  if (outcome === "revealed") return Rating.Again;
  if (outcome === "correct" && attempts <= 1) return Rating.Good;
  return Rating.Hard;
}

/** rating from a re-attempt during review: correct = Good, wrong = Again */
export function ratingFromReviewAttempt(correct: boolean): Rating {
  return correct ? Rating.Good : Rating.Again;
}

export function scheduleNext(card: Card | undefined, rating: Rating, now: Date): Card {
  const record = fsrs.next(card ?? createEmptyCard(now), now, rating as Grade);
  return record.card;
}

// ---- persistence ----

export async function recordOutcome(
  itemId: string,
  outcome: ItemOutcome,
  attempts: number,
  now: Date,
): Promise<void> {
  const rating = ratingFromOutcome(outcome, attempts);
  const existing = await db.reviewCards.get(itemId);
  const card = scheduleNext(existing ? deserialize(existing.card) : undefined, rating, now);
  await db.reviewCards.put({
    itemId,
    card: serialize(card),
    due: card.due.toISOString(),
    updatedAt: now.toISOString(),
  });
}

export async function recordReviewAttempt(
  itemId: string,
  correct: boolean,
  now: Date,
): Promise<ReviewCardRow | undefined> {
  const existing = await db.reviewCards.get(itemId);
  if (!existing) return undefined;
  const card = scheduleNext(deserialize(existing.card), ratingFromReviewAttempt(correct), now);
  const row = {
    itemId,
    card: serialize(card),
    due: card.due.toISOString(),
    updatedAt: now.toISOString(),
  };
  await db.reviewCards.put(row);
  return row;
}

export function dueCards(rows: ReviewCardRow[], now: Date): ReviewCardRow[] {
  return rows.filter((r) => new Date(r.due) <= now);
}

export function listCards(): Promise<ReviewCardRow[]> {
  return db.reviewCards.toArray();
}

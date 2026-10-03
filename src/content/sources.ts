import americanEnglishEverydayConversations from "./sources/american-english-everyday-conversations.json";
import aeEnglishTeachingForum from "./sources/ae-english-teaching-forum.json";
import evergreenBeginningLs from "./sources/evergreen-beginning-listening-speaking.json";
import pccEsolDigitalWorkbook from "./sources/pcc-esol-digital-workbook.json";
import voaLetsLearnEnglish1 from "./sources/voa-lets-learn-english-level-1.json";

// Source registry — canonical machine-readable provenance records
// (LRMI-aligned, see docs/sources/README.md). Lessons reference these by
// source.id; registry fields are the defaults a lesson may override at
// item level (e.g. an embedded exercise with its own license).
export interface SourceRecord {
  id: string;
  type?: string;
  title: string;
  authors: string[];
  publisher: string;
  url: string;
  license: string;
  licenseUrl?: string;
  contentType?: string[];
  levels?: string[];
  subjects?: string[];
  reuseStatus: "approved" | "review-required" | "reference-only" | "prohibited";
  provenanceNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  adaptationLog?: {
    item: string;
    itemUrl?: string;
    itemLicense?: string;
    itemAuthors?: string[];
    usedIn?: string;
    /** path to retained license evidence (e.g. docs/sources/evidence/) */
    evidence?: string;
    notes?: string;
  }[];
  /** third-party items embedded from their original host (not copied) */
  externalAssets?: {
    item: string;
    provider: string;
    originalUrl: string;
    embedSrc: string;
    rightsStatus: "redistributable" | "embed-only" | "link-only" | "unknown";
    reason: string;
    verifiedAt: string;
    usedIn?: string;
  }[];
}

const pcc = pccEsolDigitalWorkbook as SourceRecord;
const voa = voaLetsLearnEnglish1 as SourceRecord;
const evergreen = evergreenBeginningLs as SourceRecord;
const ae = americanEnglishEverydayConversations as SourceRecord;
const aeForum = aeEnglishTeachingForum as SourceRecord;

export const sourceRecords: readonly SourceRecord[] = [
  pcc,
  voa,
  evergreen,
  ae,
  aeForum,
];

export function getSourceRecord(id: string): SourceRecord | undefined {
  return sourceRecords.find((s) => s.id === id);
}

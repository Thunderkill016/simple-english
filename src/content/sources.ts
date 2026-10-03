import pccEsolDigitalWorkbook from "./sources/pcc-esol-digital-workbook.json";

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
  reuseStatus: "approved" | "review-required" | "prohibited";
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
}

const pcc = pccEsolDigitalWorkbook as SourceRecord;

export const sourceRecords: readonly SourceRecord[] = [pcc];

export function getSourceRecord(id: string): SourceRecord | undefined {
  return sourceRecords.find((s) => s.id === id);
}

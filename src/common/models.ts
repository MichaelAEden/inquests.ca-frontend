// Note the expression of the NOT NULL constraint:
// field: number;         NOT NULL
// field?: number;        NOT NULL with default, auto-increment, etc.
// field: number | null;  NULL

export interface Authority {
  authorityId?: number;
  isPrimary?: number;
  primaryField: string | null;
  isJudicialReview?: number;
  name: string;
  overview: string;
  synopsis: string;
  quotes: string | null;
  notes: string | null;
  tags: string | null;
  inquests: Inquest[];
  authorityDocuments: AuthorityDocument[];
  authorityKeywords: AuthorityKeyword[];
  authorityCitations: Authority[];
  authorityCitedBy: Authority[];
  authorityRelated: Authority[];
  authorityRelatedBy: Authority[];
}

export interface AuthorityCategory {
  authorityCategoryId: string;
  name: string;
  description: string | null;
  authorityKeywords: AuthorityKeyword[];
}

export interface AuthorityDocument {
  authorityDocumentId?: number;
  authorityId: number;
  authorityDocumentTypeId: string | null;
  sourceId: string;
  isPrimary?: number;
  name: string;
  citation: string | null;
  created: string | null;
  source: Source;
  authority: Authority;
  authorityDocumentType: AuthorityDocumentType;
  authorityDocumentLinks: AuthorityDocumentLink[];
}

export interface AuthorityDocumentLink {
  authorityDocumentId: number;
  documentSourceId: string;
  link: string;
  documentSource: DocumentSource;
  authorityDocument: AuthorityDocument;
}

export interface AuthorityDocumentType {
  authorityDocumentTypeId: string;
  name: string;
  description: string | null;
}

export interface AuthorityKeyword {
  authorityKeywordId: string;
  authorityCategoryId: string;
  name: string;
  description: string | null;
  synonyms: string | null;
  authorityCategory: AuthorityCategory;
}

export interface DeathManner {
  deathMannerId: string;
  name: string;
}

export interface DeathCause {
  deathCauseId: string;
  name: string;
  description: string | null;
  synonyms: string | null;
}

export interface Deceased {
  deceasedId?: number;
  inquestId: number;
  inquestReasonId: string;
  deathMannerId: string;
  deathCauseId: string;
  deathCause: string;
  deathDate: string;
  deathLocation: string | null;
  lastName: string | null;
  givenNames: string | null;
  age: number | null;
  ageUnit: string | null;
  sex: string | null;
  deathManner: DeathManner;
  inquest: Inquest;
  inquestReason: InquestReason;
}

export interface DocumentSource {
  documentSourceId: string;
  name: string;
  isFree?: number;
}

export interface Inquest {
  inquestId?: number;
  jurisdictionId: string;
  location: string | null;
  isPrimary?: number;
  name: string;
  overview: string | null;
  synopsis: string;
  notes: string | null;
  presidingOfficer: string;
  start: string;
  end: string | null;
  sittingDays: number | null;
  exhibits: number | null;
  recommendations: number | null;
  tags: string | null;
  deceased: Deceased[];
  jurisdiction: Jurisdiction;
  inquestDocuments: InquestDocument[];
  inquestKeywords: InquestKeyword[];
  authorities: Authority[];
}

export interface InquestCategory {
  inquestCategoryId: string;
  name: string;
  description: string | null;
  inquestKeywords: InquestKeyword[];
}

export interface InquestDocument {
  inquestDocumentId?: number;
  inquestId: number;
  inquestDocumentTypeId: string | null;
  name: string;
  created: string;
  inquest: Inquest;
  inquestDocumentType: InquestDocumentType;
  inquestDocumentLinks: InquestDocumentLink[];
}

export interface InquestDocumentLink {
  inquestDocumentId: number;
  documentSourceId: string;
  link: string;
  documentSource: DocumentSource;
  inquestDocument: InquestDocument;
}

export interface InquestDocumentType {
  inquestDocumentTypeId: string;
  name: string;
  description: string | null;
}

export interface InquestKeyword {
  inquestKeywordId: string;
  inquestCategoryId: string | null;
  name: string;
  description: string | null;
  synonyms: string | null;
  inquestCategory: InquestCategory;
}

export interface InquestReason {
  inquestReasonId: string;
  name: string;
  isMandatory: number;
}

export interface Jurisdiction {
  jurisdictionId: string;
  federalJurisdictionId: string;
  name: string;
  code: string;
  federalJurisdiction: Jurisdiction;
  jurisdictions: Jurisdiction[];
}

export interface Source {
  sourceId: string;
  jurisdictionId: string | null;
  name: string;
  code: string;
  rank: number;
  jurisdiction: Jurisdiction;
}

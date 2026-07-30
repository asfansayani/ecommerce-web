import { Pagination } from "./common";

export interface ContentSectionTranslation {
  id: number;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  language: string;
  sectionId: number;
}

export interface ContentSection {
  id: number;
  createdAt: string;
  updatedAt: string;
  page: string;
  placement: number;
  type: string;
  backgroundMedias: unknown[];
  foregroundMedias: unknown[];
  icon: string | null;
  metadata: unknown | null;
  parentId: number | null;
  translations: ContentSectionTranslation[];
  subContent: ContentSection[];
}

export interface ContentSectionsResponse {
  success: boolean;
  statusCode: number;
  data: ContentSection[];
  meta: Pagination;
}

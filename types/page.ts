export type PageType =
  | "PRIVACY_POLICY"
  | "TERMS_CONDITIONS"
  | "RETURN_POLICY"
  | "ABOUT_US";

export interface PageTranslation {
  id: number;
  language: string;
  content: string;
  pageId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPage {
  id: number;
  type: PageType;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  translations: PageTranslation[];
}

export interface PageResponse {
  message: string;
  success: boolean;
  statusCode: number;
  data: CmsPage;
}

export const PAGE_IDS = {
  PRIVACY_POLICY: 1,
  TERMS_CONDITIONS: 2,
  ABOUT_US: 3,
} as const;

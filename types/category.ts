import { Pagination, Translations } from "./common";

export interface Category {
    id: number;
    name: string;
    image?: string;
    description?: string;
    translations?: Translations[];
    subcategories?: Category[];
}

export interface CategoriesResponse {
    data: Category[];
    meta: Pagination;
}
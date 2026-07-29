import { Pagination, Translations } from "./common";

export interface Product {
    id: number;
    image: string;
    name: string;
    description: string;
    price: string;
    translations: Translations[];
}

export interface ProductsResponse {
    data: Product[];
    meta: Pagination;
}
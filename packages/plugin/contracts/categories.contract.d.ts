import { AbstractContract } from "@cmmv/core";
export declare class CategoriesContract extends AbstractContract {
    name: string;
    slug: string;
    parentCategory: string;
    active: boolean;
    navigationLabel: string;
    description?: string;
    postCount: number;
    PublicCategoriesListResponse: {};
    PublicCategoriesList: Function;
}

import { CategoriesPublicService } from "./categories.service";
export declare class CategoriesPublicController {
    private readonly categoriesPublicService;
    constructor(categoriesPublicService: CategoriesPublicService);
    get(queries: any, req: any): Promise<string | any[]>;
    getBySlug(slug: string): Promise<{
        category: any;
        posts: import("@cmmv/repository").IFindResponse;
    }>;
    getById(id: string): Promise<{
        category: any;
        posts: import("@cmmv/repository").IFindResponse;
    }>;
}

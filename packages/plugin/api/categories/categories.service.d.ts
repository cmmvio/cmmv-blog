import { PostsPublicService } from "../posts/posts.service";
export declare class CategoriesPublicService {
    private readonly postsService;
    constructor(postsService: PostsPublicService);
    getAll(queries: any, req: any): Promise<string | any[]>;
    getBySlug(slug: string): Promise<{
        category: any;
        posts: import("@cmmv/repository").IFindResponse;
    }>;
    getById(id: string): Promise<{
        category: any;
        posts: import("@cmmv/repository").IFindResponse;
    }>;
}

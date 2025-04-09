import { PostsPublicService } from "./posts.service";
export declare class PostsController {
    private readonly postsPublicService;
    constructor(postsPublicService: PostsPublicService);
    getPosts(queries: any, req: any): Promise<{
        posts: any;
        count: number;
        pagination: import("@cmmv/repository").IFindPagination;
        authors: any[];
        categories: any[];
    }>;
    getPages(queries: any, req: any): Promise<{
        posts: any;
        count: number;
        pagination: import("@cmmv/repository").IFindPagination;
        authors: any[];
    }>;
    getBySlug(slug: string, res: any): Promise<string>;
    getPageBySlug(slug: string, res: any): Promise<string>;
    getById(id: string, res: any): Promise<string>;
    getPageById(id: string, res: any): Promise<string>;
    getTags(queries: any, res: any): Promise<string | any[]>;
    getPostsByTagSlug(slug: string, res: any): Promise<{
        posts: any;
        tag: any;
    }>;
    savePost(body: any, user: any): Promise<any>;
    savePage(body: any, user: any): Promise<any>;
}

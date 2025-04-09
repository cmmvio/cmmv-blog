import { IPostMetadata, IDraftPost } from "./posts.interface";
import { MediasService } from "../medias/medias.service";
export declare class PostsPublicService {
    private readonly mediasService;
    constructor(mediasService: MediasService);
    getAllPosts(queries: any, req: any): Promise<{
        posts: any;
        count: number;
        pagination: import("@cmmv/repository").IFindPagination;
        authors: any[];
        categories: any[];
    }>;
    getAllPages(queries: any, req: any): Promise<{
        posts: any;
        count: number;
        pagination: import("@cmmv/repository").IFindPagination;
        authors: any[];
    }>;
    getTags(queries: any): Promise<string | any[]>;
    savePost(data: {
        post: IDraftPost;
        meta: IPostMetadata;
    }, user: any): Promise<any>;
    savePage(data: {
        post: IDraftPost;
        meta: IPostMetadata;
    }, user: any): Promise<any>;
    getPostBySlug(slug: string): Promise<string>;
    getPageBySlug(slug: string): Promise<string>;
    getPostById(id: string): Promise<string>;
    getPageById(id: string): Promise<string>;
    getPostsByCategory(categoryId: string): Promise<import("@cmmv/repository").IFindResponse>;
    getPostsByTagSlug(tagSlug: string): Promise<{
        posts: any;
        tag: any;
    }>;
    getPostsByTag(tagName: string): Promise<{
        posts: any;
        tag: any;
    }>;
    upsertTags(tags: string[]): Promise<void>;
    recalculateTags(): Promise<void>;
    recalculateCategories(): Promise<void>;
}

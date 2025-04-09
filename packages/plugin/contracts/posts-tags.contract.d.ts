import { AbstractContract } from "@cmmv/core";
export declare class PostsTagsContract extends AbstractContract {
    name: string;
    slug: string;
    navigationLabel?: string;
    description?: string;
    postCount: number;
}

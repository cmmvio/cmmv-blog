import { AbstractContract } from "@cmmv/core";
export declare class PostsHistoryContract extends AbstractContract {
    post: string;
    lexicalContent?: string;
    authorId: string;
    title: string;
    postStatus: string;
    reason?: string;
    featureImage?: string;
    featureImageAlt?: string;
    featureImageCaption?: string;
}

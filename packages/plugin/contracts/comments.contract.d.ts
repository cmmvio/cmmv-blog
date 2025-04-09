import { AbstractContract } from "@cmmv/core";
export declare class CommentsContract extends AbstractContract {
    post: string;
    member: string;
    parentId?: string;
    inReplyTo?: string;
    status: string;
    content: string;
    editedAt?: Date;
}

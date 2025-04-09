import { AbstractContract } from "@cmmv/core";
export declare class AuthorProfileContract extends AbstractContract {
    user: string;
    name: string;
    slug: string;
    image?: string;
    coverImage?: string;
    bio?: string;
    website?: string;
    location?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    locale?: string;
    visibility?: string;
    metaTitle?: string;
    metaDescription?: string;
    lastSeen?: number;
    commentNotifications?: boolean;
    mentionNotifications?: boolean;
    recommendationNotifications?: boolean;
}

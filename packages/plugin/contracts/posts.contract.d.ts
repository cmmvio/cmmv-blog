import { AbstractContract } from "@cmmv/core";
export declare class PostsContract extends AbstractContract {
    author: string;
    authors: string[];
    title: string;
    excerpt?: string;
    content: string;
    categories: string[];
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    publishedAt?: Date;
    autoPublishAt?: number;
    image?: string;
    featured: boolean;
    featureImage?: string;
    featureImageAlt?: string;
    featureImageCaption?: string;
    tags?: string[];
    type: string;
    status: string;
    visibility: string;
    codeInjectionHead?: string;
    codeInjectionBody?: string;
    canonicalUrl?: string;
    views: number;
    comments: number;
}

export interface IDraftPost {
    id?: string;
    title: string;
    content: string;
    tags: string[];
    categories: string[];
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    publishedAt?: number;
    autoPublishAt?: number;
    image?: string;
    featured?: boolean;
    featureImage?: string;
    featureImageAlt?: string;
    featureImageCaption?: string;
    codeInjectionHead?: string;
    codeInjectionBody?: string;
    canonicalUrl?: string;
    status: string;
    visibility: string;
    type: string;
    authors: string[];
}

export interface IPostMetadata {
    post: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}
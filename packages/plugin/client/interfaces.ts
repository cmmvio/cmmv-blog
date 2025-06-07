export type ICategory = {
    id: string;
    name: string;
    slug: string;
    parentCategory: string;
    active: boolean;
    navigationLabel: string;
    postCount: number;
}

export type ITag = {
    id: string;
    name: string;
    slug: string;
    postCount: number;
}

export type IUserProfile = {
    id: string;
    name: string;
    slug: string;
    email: string;
    image: string;
    coverImage: string;
    bio: string;
    website: string;
    location: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
    locale: string;
    visibility: string;
    metaTitle: string;
    metaDescription: string;
    lastSeen: number;
    commentNotifications: boolean;
    mentionNotifications: boolean;
    recommendationNotifications: boolean;
}


export interface IProfile {
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
    locale: string;
    visibility: string;
    metaTitle: string;
    metaDescription: string;
    lastSeen: number;
    commentNotifications: boolean;
    mentionNotifications: boolean;
    recommendationNotifications: boolean;
}

import { BlogProfileService } from "./profile.service";
interface IProfile {
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
export declare class BlogProfileController {
    private readonly blogProfileService;
    constructor(blogProfileService: BlogProfileService);
    getProfile(user: any): Promise<any>;
    updateProfile(user: any, profile: IProfile): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};

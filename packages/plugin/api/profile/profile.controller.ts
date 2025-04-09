import {
    Controller,
    Get,
    Put,
    Body,
    User
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    BlogProfileService
} from "./profile.service";

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

@Controller()
export class BlogProfileController {
    constructor(
        private readonly blogProfileService: BlogProfileService
    ) {}

    @Get("profile", { exclude: true })
    @Auth()
    public async getProfile(@User() user: any) {
        return this.blogProfileService.getProfile(user);
    }

    @Put("profile", { exclude: true })
    @Auth()
    public async updateProfile(@User() user: any, @Body() profile: IProfile) {
        return this.blogProfileService.updateProfile(user, profile);
    }
}

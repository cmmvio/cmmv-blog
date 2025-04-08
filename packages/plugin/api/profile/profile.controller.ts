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

import {
    IProfile
} from "./profile.interface";

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

import { Application } from "@cmmv/core";
import { Auth } from "@cmmv/auth";

import {
    Controller, Get, Post, Put,
    Param, Body, Req, RouterSchema,
    CacheControl, ContentType, Header
} from "@cmmv/http";

import {
    MembersPublicService
} from "./members.service";

interface IMember {
    email: string;
    name: string;
    note?: string;
    getLocation?: string;
    emailCount?: number;
    emailOpenedCount?: number;
    emailOpenRate?: number;
    emailDisabled?: boolean;
    lastSeenAt?: Date;
    lastCommentedAt?: Date;
}

interface IMemberCreatePayload {
    email: string;
    name: string;
    note?: string;
    getLocation?: string;
    password: string;
}

interface IMemberUpdatePayload {
    name?: string;
    note?: string;
    getLocation?: string;
    emailDisabled?: boolean;
}

interface IMemberLoginPayload {
    email: string;
    password: string;
}

@Controller('blog')
export class MembersPublicController {
    constructor(private readonly membersPublicService: MembersPublicService) {}

    @Post('members', {
        contract: Application.getContract('MemberContract'),
        schema: RouterSchema.Insert,
        summary: 'Create a new member'
    })
    async createMember(@Body() payload: IMemberCreatePayload) {
        return this.membersPublicService.createMember(payload);
    }

    @Get('members/profile/:id', {
        contract: Application.getContract('MemberContract'),
        schema: RouterSchema.GetByID,
        summary: 'Get a member profile by ID',
        exposeFilters: true
    })
    @CacheControl({ maxAge: 3600, public: false })
    @ContentType('application/json')
    async getProfile(@Param('id') id: string) {
        return this.membersPublicService.getProfileByID(id);
    }

    @Get('members/me', {
        contract: Application.getContract('MemberContract'),
        schema: RouterSchema.GetByID,
        summary: 'Get current member profile',
        exposeFilters: true
    })
    @CacheControl({ maxAge: 0, public: false })
    @ContentType('application/json')
    async getMyProfile(@Header("Authorization") token: string) {
        return this.membersPublicService.getProfile(token);
    }

    @Put('members/profile/:id', {
        contract: Application.getContract('MemberContract'),
        schema: RouterSchema.Update,
        summary: 'Update a member profile'
    })
    @Auth()
    async updateProfile(
        @Param('id') id: string,
        @Body() payload: IMemberUpdatePayload,
        @Req() req: any
    ) {
        if (!req.user?.id)
            throw new Error('Authentication required');

        return this.membersPublicService.updateProfile(id, payload, req.user.id);
    }

    @Post('members/login', {
        contract: Application.getContract('MemberContract'),
        summary: 'Login a member'
    })
    async login(@Body() payload: IMemberLoginPayload) {
        return this.membersPublicService.login(payload);
    }
}
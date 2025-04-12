import { Application } from "@cmmv/core";
import { Auth } from "@cmmv/auth";

import {
    Controller, Get, Post, Put, Delete,
    Queries, Param, Body, Req, RouterSchema,
    CacheControl, ContentType, Raw
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
}

interface IMemberUpdatePayload {
    name?: string;
    note?: string;
    getLocation?: string;
    emailDisabled?: boolean;
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
    async getProfile(@Param('id') id: string, @Req() req: any) {
        // Get the current user ID from the authenticated request
        const currentUserId = req.user?.id || null;

        return this.membersPublicService.getProfile(id, currentUserId);
    }

    @Get('members/me', {
        contract: Application.getContract('MemberContract'),
        schema: RouterSchema.GetByID,
        summary: 'Get current member profile',
        exposeFilters: true
    })
    @Auth()
    @CacheControl({ maxAge: 0, public: false })
    @ContentType('application/json')
    async getMyProfile(@Req() req: any) {
        // Make sure we're authenticated
        if (!req.user?.id) {
            throw new Error('Authentication required');
        }

        return this.membersPublicService.getProfile(req.user.id, req.user.id);
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
        // Make sure we're authenticated
        if (!req.user?.id) {
            throw new Error('Authentication required');
        }

        return this.membersPublicService.updateProfile(id, payload, req.user.id);
    }
}

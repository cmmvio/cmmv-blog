import { Application } from "@cmmv/core";
import { Auth } from "@cmmv/auth";

import {
    Controller, Get, Post, Put, Delete,
    Queries, Param, Body, Req, RouterSchema
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

@Controller('api')
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
}
import { Module } from '@cmmv/core';

import {
    MemberContract
} from '../../contracts';

import {
    MembersPublicService
} from "./members.service";

import {
    MembersPublicController
} from "./members.controller";

export const MembersModule = new Module('blog_members_public', {
    contracts: [MemberContract],
    controllers: [MembersPublicController],
    providers: [MembersPublicService]
});

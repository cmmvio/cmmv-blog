import { Module } from '@cmmv/core';

import {
    MemberContract
} from '../contracts';

export const MembersModule = new Module('blog_members', {
    contracts: [
        MemberContract
    ],
});

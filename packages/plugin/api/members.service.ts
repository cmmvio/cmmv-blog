import {
    Service
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

import {
    IMemberCreatePayload
} from "./members.interface";

@Service('blog_members_public')
export class MembersPublicService {
    async createMember(payload: IMemberCreatePayload) {
        //const memberEntity = Repository.getEntity('MembersEntity');
        //const member = await Repository.insert(memberEntity, member);
        //return member;
    }
}

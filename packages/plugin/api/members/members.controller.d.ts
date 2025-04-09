import { MembersPublicService } from "./members.service";
interface IMemberCreatePayload {
    email: string;
    name: string;
    note?: string;
    getLocation?: string;
}
export declare class MembersPublicController {
    private readonly membersPublicService;
    constructor(membersPublicService: MembersPublicService);
    createMember(payload: IMemberCreatePayload): Promise<void>;
}
export {};

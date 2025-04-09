import { AbstractContract } from "@cmmv/core";
export declare class MemberContract extends AbstractContract {
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

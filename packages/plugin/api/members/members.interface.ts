export interface IMember {
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

export interface IMemberCreatePayload {
    email: string;
    name: string;
    note?: string;
    getLocation?: string;
}
import { AbstractContract } from "@cmmv/core";
export declare class AnalyticsAccessContract extends AbstractContract {
    path: string;
    postId?: string;
    ip?: string;
    agent?: string;
    referer?: string;
    startTime: number;
    endTime: number;
    summarized: boolean;
}

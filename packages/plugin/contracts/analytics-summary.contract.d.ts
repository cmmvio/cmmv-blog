import { AbstractContract } from "@cmmv/core";
export declare class AnalyticsSummaryContract extends AbstractContract {
    date: Date;
    totalAccess: number;
    uniqueAccess: number;
    bounceRate: number;
    avgTimeOnPage: number;
}

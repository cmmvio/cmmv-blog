import { Module } from '@cmmv/core';

import {
    AnalyticsAccessContract,
    AnalyticsSummaryContract
} from "../../contracts"

import {
    AnalyticsController
} from "./analytics.controller";

import {
    AnalyticsService
} from "./analytics.service";

export const AnalyticsModule = new Module('blog_analytics', {
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    contracts: [
        AnalyticsAccessContract,
        AnalyticsSummaryContract
    ]
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const core_1 = require("@cmmv/core");
const contracts_1 = require("../../contracts");
const analytics_controller_1 = require("./analytics.controller");
const analytics_service_1 = require("./analytics.service");
exports.AnalyticsModule = new core_1.Module('blog_analytics', {
    controllers: [analytics_controller_1.AnalyticsController],
    providers: [analytics_service_1.AnalyticsService],
    contracts: [
        contracts_1.AnalyticsAccessContract,
        contracts_1.AnalyticsSummaryContract
    ]
});
//# sourceMappingURL=analytics.module.js.map
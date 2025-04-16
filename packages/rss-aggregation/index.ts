export * from "./admin";
export * from "./contracts";

import { RSSAggregationModule } from "./api/rss-aggregation.module";
import * as admin from "./admin/index";
import * as contracts from "./contracts/index";

export default {
    name: '@cmmv/rss-aggregation',
    version: '0.0.1',
    description: 'RSS Aggregation package for CMMV',
    api: RSSAggregationModule,
    contracts,
    admin,
    dependencies: [
        "@cmmv/http",
        "@cmmv/repository",
        "@cmmv/admin",
        "@cmmv/auth",
        "@cmmv/blog"
    ]
}
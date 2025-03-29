export * from "./api";
export * from "./admin";
export * from "./client";
export * from "./contracts";

import { BlogModule } from "./api";
import * as admin from "./admin/index";
import * as clients from "./client/index";
import * as contracts from "./contracts/index";

export default {
    name: '@cmmv/blog',
    version: '0.0.1',
    description: 'Blog package for CMMV',
    api: BlogModule,
    clients,
    contracts,
    admin,
    dependencies: [
        "@cmmv/http",
        "@cmmv/repository",
        "@cmmv/admin",
        "@cmmv/auth"
    ]
}
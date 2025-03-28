export * from "./api";
export * from "./admin";
export * from "./client";
export * from "./contracts";

import { BlogModule } from "./api";

export default {
    name: 'cmmv-blog',
    version: '0.0.1',
    description: 'Blog package for CMMV',
    api: BlogModule,
    dependencies: [
        "@cmmv/http",
        "@cmmv/repository",
        "@cmmv/admin",
        "@cmmv/auth"
    ]
}
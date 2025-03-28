export * from "./api";
export * from "./admin";
export * from "./client";
export * from "./contracts";

export default {
    name: 'cmmv-blog',
    version: '0.0.1',
    description: 'Blog package for CMMV',
    dependencies: [
        "@cmmv/http",
        "@cmmv/repository",
        "@cmmv/admin",
        "@cmmv/auth"
    ]
}
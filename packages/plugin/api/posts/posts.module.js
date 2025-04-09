"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const core_1 = require("@cmmv/core");
const contracts_1 = require("../../contracts");
const posts_controller_1 = require("./posts.controller");
const posts_service_1 = require("./posts.service");
exports.PostsModule = new core_1.Module('blog_posts', {
    controllers: [posts_controller_1.PostsController],
    providers: [posts_service_1.PostsPublicService],
    contracts: [
        contracts_1.PostsContract,
        contracts_1.PostsHistoryContract,
        contracts_1.PostsMetaContract,
        contracts_1.PostsTagsContract
    ]
});
//# sourceMappingURL=posts.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const core_1 = require("@cmmv/core");
const contracts_1 = require("../../contracts");
exports.CommentsModule = new core_1.Module('blog_comments', {
    contracts: [
        contracts_1.CommentsContract,
        contracts_1.CommentsLikesContract
    ],
});
//# sourceMappingURL=comments.module.js.map
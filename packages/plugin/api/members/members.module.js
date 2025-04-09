"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersModule = void 0;
const core_1 = require("@cmmv/core");
const contracts_1 = require("../../contracts");
const members_service_1 = require("./members.service");
const members_controller_1 = require("./members.controller");
exports.MembersModule = new core_1.Module('blog_members_public', {
    contracts: [contracts_1.MemberContract],
    controllers: [members_controller_1.MembersPublicController],
    providers: [members_service_1.MembersPublicService]
});
//# sourceMappingURL=members.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const core_1 = require("@cmmv/core");
const contracts_1 = require("../../contracts");
const profile_controller_1 = require("./profile.controller");
const profile_service_1 = require("./profile.service");
exports.ProfileModule = new core_1.Module('blog_profile', {
    controllers: [profile_controller_1.BlogProfileController],
    providers: [profile_service_1.BlogProfileService],
    contracts: [contracts_1.AuthorProfileContract]
});
//# sourceMappingURL=profile.module.js.map
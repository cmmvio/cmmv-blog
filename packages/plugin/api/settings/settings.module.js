"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSettingsModule = void 0;
const core_1 = require("@cmmv/core");
const settings_controller_1 = require("./settings.controller");
const settings_services_1 = require("./settings.services");
exports.BlogSettingsModule = new core_1.Module('blog_settings', {
    controllers: [settings_controller_1.BlogSettingsController],
    providers: [settings_services_1.BlogSettingsService]
});
//# sourceMappingURL=settings.module.js.map
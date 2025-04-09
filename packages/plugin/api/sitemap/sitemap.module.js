"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapModule = void 0;
const core_1 = require("@cmmv/core");
const sitemap_controller_1 = require("./sitemap.controller");
const sitemap_service_1 = require("./sitemap.service");
exports.SitemapModule = new core_1.Module('sitemap', {
    controllers: [sitemap_controller_1.SitemapController],
    providers: [sitemap_service_1.SitemapService]
});
//# sourceMappingURL=sitemap.module.js.map
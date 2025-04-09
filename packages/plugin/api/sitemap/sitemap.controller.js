"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapController = void 0;
const http_1 = require("@cmmv/http");
const sitemap_service_1 = require("./sitemap.service");
let SitemapController = class SitemapController {
    sitemapService;
    constructor(sitemapService) {
        this.sitemapService = sitemapService;
    }
    async getSitemapHandler() {
        return this.getSitemap();
    }
    async getSitemap() {
        return this.sitemapService.generateSitemapIndex();
    }
    async getSitemapIndex() {
        return this.sitemapService.getPostSitemap();
    }
    async getPageSitemap() {
        return this.sitemapService.getPostSitemap("page");
    }
    async getCategorySitemap() {
        return this.sitemapService.getCategorySitemap();
    }
    async getTagSitemap() {
        return this.sitemapService.getTagsSitemap();
    }
};
exports.SitemapController = SitemapController;
__decorate([
    (0, http_1.Get)('sitemap'),
    (0, http_1.ContentType)('text/xml'),
    (0, http_1.CacheControl)({ maxAge: 2592000, public: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitemapController.prototype, "getSitemapHandler", null);
__decorate([
    (0, http_1.Get)('sitemap.xml'),
    (0, http_1.ContentType)('text/xml'),
    (0, http_1.CacheControl)({ maxAge: 86400, public: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitemapController.prototype, "getSitemap", null);
__decorate([
    (0, http_1.Get)('post-sitemap.xml'),
    (0, http_1.ContentType)('text/xml'),
    (0, http_1.CacheControl)({ maxAge: 86400, public: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitemapController.prototype, "getSitemapIndex", null);
__decorate([
    (0, http_1.Get)('page-sitemap.xml'),
    (0, http_1.ContentType)('text/xml'),
    (0, http_1.CacheControl)({ maxAge: 86400, public: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitemapController.prototype, "getPageSitemap", null);
__decorate([
    (0, http_1.Get)('category-sitemap.xml'),
    (0, http_1.ContentType)('text/xml'),
    (0, http_1.CacheControl)({ maxAge: 86400, public: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitemapController.prototype, "getCategorySitemap", null);
__decorate([
    (0, http_1.Get)('tag-sitemap.xml'),
    (0, http_1.ContentType)('text/xml'),
    (0, http_1.CacheControl)({ maxAge: 86400, public: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitemapController.prototype, "getTagSitemap", null);
exports.SitemapController = SitemapController = __decorate([
    (0, http_1.Controller)(),
    __metadata("design:paramtypes", [sitemap_service_1.SitemapService])
], SitemapController);
//# sourceMappingURL=sitemap.controller.js.map
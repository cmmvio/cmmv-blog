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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSettingsController = void 0;
const core_1 = require("@cmmv/core");
const http_1 = require("@cmmv/http");
const auth_1 = require("@cmmv/auth");
const settings_services_1 = require("./settings.services");
let BlogSettingsController = class BlogSettingsController {
    blogSettingsService;
    constructor(blogSettingsService) {
        this.blogSettingsService = blogSettingsService;
    }
    async getSetup(setupData) {
        return this.blogSettingsService.getSetup(setupData);
    }
    async getSettings() {
        return await this.blogSettingsService.getSettings();
    }
    async getAllSettings() {
        return this.blogSettingsService.getAllSettings();
    }
    async getSetting(key) {
        return this.blogSettingsService.getSetting(key);
    }
    async updasertSetting(setting) {
        return this.blogSettingsService.upsertSetting(setting);
    }
    async getRobotsTxt() {
        return core_1.Config.get("blog.robotsTxt");
    }
};
exports.BlogSettingsController = BlogSettingsController;
__decorate([
    (0, http_1.Post)('setup', { exclude: true }),
    __param(0, (0, http_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogSettingsController.prototype, "getSetup", null);
__decorate([
    (0, http_1.Get)('settings', { exclude: true }),
    (0, http_1.CacheControl)({ maxAge: 60 * 60 * 10 }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogSettingsController.prototype, "getSettings", null);
__decorate([
    (0, http_1.Get)('settings-root', { exclude: true }),
    (0, auth_1.Auth)({ rootOnly: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogSettingsController.prototype, "getAllSettings", null);
__decorate([
    (0, http_1.Get)('settings/:key', { exclude: true }),
    (0, http_1.CacheControl)({ maxAge: 60 * 60 * 10 }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogSettingsController.prototype, "getSetting", null);
__decorate([
    (0, http_1.Put)('settings', { exclude: true }),
    (0, auth_1.Auth)({ rootOnly: true }),
    __param(0, (0, http_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlogSettingsController.prototype, "updasertSetting", null);
__decorate([
    (0, http_1.Get)('robots.txt', { exclude: true }),
    (0, http_1.CacheControl)({ maxAge: 60 * 60 * 24 }),
    (0, http_1.ContentType)('text/plain'),
    (0, http_1.Raw)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogSettingsController.prototype, "getRobotsTxt", null);
exports.BlogSettingsController = BlogSettingsController = __decorate([
    (0, http_1.Controller)(),
    __metadata("design:paramtypes", [settings_services_1.BlogSettingsService])
], BlogSettingsController);
//# sourceMappingURL=settings.controller.js.map
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
exports.AnalyticsController = void 0;
const http_1 = require("@cmmv/http");
const analytics_service_1 = require("./analytics.service");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async parseForm(req) {
        const buffers = [];
        for await (const chunk of req)
            buffers.push(chunk);
        const body = Buffer.concat(buffers).toString();
        return Object.fromEntries(new URLSearchParams(body).entries());
    }
    async getAnalyticsAccess(ip, req) {
        const parsed = await this.parseForm(req.req);
        await this.analyticsService.registryAccess({
            path: parsed.path,
            ip,
            startTime: parseInt(parsed.t),
            endTime: 0,
            referer: req.get("referer") || undefined,
            agent: req.get("user-agent") || undefined
        });
        return Buffer.from([0x00]);
    }
    async getAnalyticsUnload(ip, req) {
        const parsed = await this.parseForm(req.req);
        await this.analyticsService.registryUnload(parsed.path, ip);
        return Buffer.from([0x00]);
    }
    async getAnalyticsReport() {
        await this.analyticsService.generateReport();
        return Buffer.from([0x00]);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, http_1.Post)("access"),
    (0, http_1.ContentType)("text/plain"),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Ip)()),
    __param(1, (0, http_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAnalyticsAccess", null);
__decorate([
    (0, http_1.Post)("unload"),
    (0, http_1.ContentType)("text/plain"),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Ip)()),
    __param(1, (0, http_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAnalyticsUnload", null);
__decorate([
    (0, http_1.Get)("report"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAnalyticsReport", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, http_1.Controller)("analytics"),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map
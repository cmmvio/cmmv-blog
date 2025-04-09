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
exports.BlogProfileController = void 0;
const http_1 = require("@cmmv/http");
const auth_1 = require("@cmmv/auth");
const profile_service_1 = require("./profile.service");
let BlogProfileController = class BlogProfileController {
    blogProfileService;
    constructor(blogProfileService) {
        this.blogProfileService = blogProfileService;
    }
    async getProfile(user) {
        return this.blogProfileService.getProfile(user);
    }
    async updateProfile(user, profile) {
        return this.blogProfileService.updateProfile(user, profile);
    }
};
exports.BlogProfileController = BlogProfileController;
__decorate([
    (0, http_1.Get)("profile", { exclude: true }),
    (0, auth_1.Auth)(),
    __param(0, (0, http_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogProfileController.prototype, "getProfile", null);
__decorate([
    (0, http_1.Put)("profile", { exclude: true }),
    (0, auth_1.Auth)(),
    __param(0, (0, http_1.User)()),
    __param(1, (0, http_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BlogProfileController.prototype, "updateProfile", null);
exports.BlogProfileController = BlogProfileController = __decorate([
    (0, http_1.Controller)(),
    __metadata("design:paramtypes", [profile_service_1.BlogProfileService])
], BlogProfileController);
//# sourceMappingURL=profile.controller.js.map
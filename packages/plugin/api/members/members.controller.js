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
exports.MembersPublicController = void 0;
const core_1 = require("@cmmv/core");
const http_1 = require("@cmmv/http");
const members_service_1 = require("./members.service");
let MembersPublicController = class MembersPublicController {
    membersPublicService;
    constructor(membersPublicService) {
        this.membersPublicService = membersPublicService;
    }
    async createMember(payload) {
        return this.membersPublicService.createMember(payload);
    }
};
exports.MembersPublicController = MembersPublicController;
__decorate([
    (0, http_1.Post)('members', {
        contract: core_1.Application.getContract('MemberContract'),
        schema: http_1.RouterSchema.Insert,
        summary: 'Create a new member'
    }),
    __param(0, (0, http_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MembersPublicController.prototype, "createMember", null);
exports.MembersPublicController = MembersPublicController = __decorate([
    (0, http_1.Controller)('api'),
    __metadata("design:paramtypes", [members_service_1.MembersPublicService])
], MembersPublicController);
//# sourceMappingURL=members.controller.js.map
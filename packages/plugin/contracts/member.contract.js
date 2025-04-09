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
exports.MemberContract = void 0;
const core_1 = require("@cmmv/core");
let MemberContract = class MemberContract extends core_1.AbstractContract {
    email;
    name;
    note;
    getLocation;
    emailCount;
    emailOpenedCount;
    emailOpenRate;
    emailDisabled;
    lastSeenAt;
    lastCommentedAt;
};
exports.MemberContract = MemberContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], MemberContract.prototype, "email", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], MemberContract.prototype, "name", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], MemberContract.prototype, "note", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], MemberContract.prototype, "getLocation", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: true
    }),
    __metadata("design:type", Number)
], MemberContract.prototype, "emailCount", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: true
    }),
    __metadata("design:type", Number)
], MemberContract.prototype, "emailOpenedCount", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'float',
        nullable: true
    }),
    __metadata("design:type", Number)
], MemberContract.prototype, "emailOpenRate", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'boolean',
        nullable: true,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], MemberContract.prototype, "emailDisabled", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], MemberContract.prototype, "lastSeenAt", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], MemberContract.prototype, "lastCommentedAt", void 0);
exports.MemberContract = MemberContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'Member',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: false,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_members",
            databaseTimestamps: true
        }
    })
], MemberContract);
//# sourceMappingURL=member.contract.js.map
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
exports.AnalyticsAccessContract = void 0;
const core_1 = require("@cmmv/core");
let AnalyticsAccessContract = class AnalyticsAccessContract extends core_1.AbstractContract {
    path;
    postId;
    ip;
    agent;
    referer;
    startTime;
    endTime;
    summarized;
};
exports.AnalyticsAccessContract = AnalyticsAccessContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], AnalyticsAccessContract.prototype, "path", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AnalyticsAccessContract.prototype, "postId", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AnalyticsAccessContract.prototype, "ip", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AnalyticsAccessContract.prototype, "agent", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AnalyticsAccessContract.prototype, "referer", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], AnalyticsAccessContract.prototype, "startTime", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], AnalyticsAccessContract.prototype, "endTime", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'boolean',
        nullable: false,
        defaultValue: false,
        index: true
    }),
    __metadata("design:type", Boolean)
], AnalyticsAccessContract.prototype, "summarized", void 0);
exports.AnalyticsAccessContract = AnalyticsAccessContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'AnalyticsAccess',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: false,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_analytics_access",
            databaseTimestamps: true
        }
    })
], AnalyticsAccessContract);
//# sourceMappingURL=analytics-access.contract.js.map
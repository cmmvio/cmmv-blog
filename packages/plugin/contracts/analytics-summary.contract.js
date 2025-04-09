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
exports.AnalyticsSummaryContract = void 0;
const core_1 = require("@cmmv/core");
let AnalyticsSummaryContract = class AnalyticsSummaryContract extends core_1.AbstractContract {
    date;
    totalAccess;
    uniqueAccess;
    bounceRate;
    avgTimeOnPage;
};
exports.AnalyticsSummaryContract = AnalyticsSummaryContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'date',
        nullable: false,
        index: true
    }),
    __metadata("design:type", Date)
], AnalyticsSummaryContract.prototype, "date", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], AnalyticsSummaryContract.prototype, "totalAccess", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], AnalyticsSummaryContract.prototype, "uniqueAccess", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], AnalyticsSummaryContract.prototype, "bounceRate", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], AnalyticsSummaryContract.prototype, "avgTimeOnPage", void 0);
exports.AnalyticsSummaryContract = AnalyticsSummaryContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'AnalyticsSummary',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: false,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_analytics_summary",
            databaseTimestamps: true
        }
    })
], AnalyticsSummaryContract);
//# sourceMappingURL=analytics-summary.contract.js.map
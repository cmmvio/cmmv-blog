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
exports.CategoriesContract = void 0;
const core_1 = require("@cmmv/core");
let CategoriesContract = class CategoriesContract extends core_1.AbstractContract {
    name;
    slug;
    parentCategory;
    active;
    navigationLabel;
    description;
    postCount;
    PublicCategoriesListResponse;
    PublicCategoriesList;
};
exports.CategoriesContract = CategoriesContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
    }),
    __metadata("design:type", String)
], CategoriesContract.prototype, "name", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
    }),
    __metadata("design:type", String)
], CategoriesContract.prototype, "slug", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], CategoriesContract.prototype, "parentCategory", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'boolean',
        nullable: false,
        defaultValue: true
    }),
    __metadata("design:type", Boolean)
], CategoriesContract.prototype, "active", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], CategoriesContract.prototype, "navigationLabel", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], CategoriesContract.prototype, "description", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int32',
        nullable: true,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], CategoriesContract.prototype, "postCount", void 0);
__decorate([
    (0, core_1.ContractMessage)({
        name: "PublicCategoriesListResponse",
        properties: {
            name: {
                type: "string",
                required: true
            },
            slug: {
                type: "string",
                required: true
            },
            parentCategory: {
                type: "string",
                required: false
            },
            active: {
                type: "bool",
                required: true
            },
            navigationLabel: {
                type: "string",
                required: false
            }
        }
    }),
    __metadata("design:type", Object)
], CategoriesContract.prototype, "PublicCategoriesListResponse", void 0);
__decorate([
    (0, core_1.ContractService)({
        name: "PublicCategoriesList",
        path: "api/categories",
        method: "GET",
        auth: false,
        functionName: "getAll",
        createBoilerplate: false,
        response: "PublicCategoriesListResponse"
    }),
    __metadata("design:type", Function)
], CategoriesContract.prototype, "PublicCategoriesList", void 0);
exports.CategoriesContract = CategoriesContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'Categories',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: true,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_categories",
            databaseTimestamps: true
        }
    })
], CategoriesContract);
//# sourceMappingURL=categories.contract.js.map
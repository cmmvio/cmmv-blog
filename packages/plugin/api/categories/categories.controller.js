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
exports.CategoriesPublicController = void 0;
const http_1 = require("@cmmv/http");
const core_1 = require("@cmmv/core");
const categories_service_1 = require("./categories.service");
let CategoriesPublicController = class CategoriesPublicController {
    categoriesPublicService;
    constructor(categoriesPublicService) {
        this.categoriesPublicService = categoriesPublicService;
    }
    async get(queries, req) {
        return await this.categoriesPublicService.getAll(queries, req);
    }
    async getBySlug(slug) {
        return await this.categoriesPublicService.getBySlug(slug);
    }
    async getById(id) {
        return await this.categoriesPublicService.getById(id);
    }
};
exports.CategoriesPublicController = CategoriesPublicController;
__decorate([
    (0, http_1.Get)("categories", {
        contract: core_1.Application.getContract("CategoriesContract"),
        schema: http_1.RouterSchema.GetAll,
        summary: "Returns all categories",
        exposeFilters: true,
        exclude: true
    }),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Queries)()),
    __param(1, (0, http_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CategoriesPublicController.prototype, "get", null);
__decorate([
    (0, http_1.Get)("categories/slug/:slug", {
        contract: core_1.Application.getContract("CategoriesContract"),
        schema: http_1.RouterSchema.GetByID,
        summary: "Returns a category by slug",
        exposeFilters: true,
        exclude: true
    }),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesPublicController.prototype, "getBySlug", null);
__decorate([
    (0, http_1.Get)("categories/:id", {
        contract: core_1.Application.getContract("CategoriesContract"),
        schema: http_1.RouterSchema.GetByID,
        summary: "Returns a category by id",
        exposeFilters: true,
        exclude: true
    }),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesPublicController.prototype, "getById", null);
exports.CategoriesPublicController = CategoriesPublicController = __decorate([
    (0, http_1.Controller)("blog"),
    __metadata("design:paramtypes", [categories_service_1.CategoriesPublicService])
], CategoriesPublicController);
//# sourceMappingURL=categories.controller.js.map
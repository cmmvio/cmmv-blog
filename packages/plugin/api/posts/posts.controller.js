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
exports.PostsController = void 0;
const core_1 = require("@cmmv/core");
const auth_1 = require("@cmmv/auth");
const http_1 = require("@cmmv/http");
const posts_service_1 = require("./posts.service");
let PostsController = class PostsController {
    postsPublicService;
    constructor(postsPublicService) {
        this.postsPublicService = postsPublicService;
    }
    async getPosts(queries, req) {
        return this.postsPublicService.getAllPosts(queries, req);
    }
    async getPages(queries, req) {
        return this.postsPublicService.getAllPages(queries, req);
    }
    async getBySlug(slug, res) {
        return await this.postsPublicService.getPostBySlug(slug);
    }
    async getPageBySlug(slug, res) {
        return await this.postsPublicService.getPageBySlug(slug);
    }
    async getById(id, res) {
        return await this.postsPublicService.getPostById(id);
    }
    async getPageById(id, res) {
        return await this.postsPublicService.getPageById(id);
    }
    async getTags(queries, res) {
        return await this.postsPublicService.getTags(queries);
    }
    async getPostsByTagSlug(slug, res) {
        return await this.postsPublicService.getPostsByTagSlug(slug);
    }
    async savePost(body, user) {
        return this.postsPublicService.savePost(body, user);
    }
    async savePage(body, user) {
        return this.postsPublicService.savePage(body, user);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, http_1.Get)("posts", {
        contract: core_1.Application.getContract("PostsContract"),
        schema: http_1.RouterSchema.GetAll,
        summary: "Returns Posts records by filter",
        exposeFilters: true,
        exclude: true
    }),
    __param(0, (0, http_1.Queries)()),
    __param(1, (0, http_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPosts", null);
__decorate([
    (0, http_1.Get)("pages", {
        contract: core_1.Application.getContract("PostsContract"),
        schema: http_1.RouterSchema.GetAll,
        summary: "Returns Pages records by filter",
        exposeFilters: true,
        exclude: true
    }),
    __param(0, (0, http_1.Queries)()),
    __param(1, (0, http_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPages", null);
__decorate([
    (0, http_1.Get)("posts/slug/:slug", {
        contract: core_1.Application.getContract("PostsContract"),
        schema: http_1.RouterSchema.GetByID,
        summary: "Returns Posts record by slug",
        exposeFilters: true,
        exclude: true
    }),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)("slug")),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getBySlug", null);
__decorate([
    (0, http_1.Get)("pages/slug/:slug", {
        contract: core_1.Application.getContract("PostsContract"),
        schema: http_1.RouterSchema.GetByID,
        summary: "Returns Pages record by slug",
        exposeFilters: true,
        exclude: true
    }),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)("slug")),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPageBySlug", null);
__decorate([
    (0, http_1.Get)("posts/:id", {
        contract: core_1.Application.getContract("PostsContract"),
        schema: http_1.RouterSchema.GetByID,
        summary: "Returns Posts record by id",
        exposeFilters: true,
        exclude: true
    }),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)("id")),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getById", null);
__decorate([
    (0, http_1.Get)("pages/:id", {
        contract: core_1.Application.getContract("PostsContract"),
        schema: http_1.RouterSchema.GetByID,
        summary: "Returns Pages record by id",
        exposeFilters: true,
        exclude: true
    }),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)("id")),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPageById", null);
__decorate([
    (0, http_1.Get)("posts/tags", {
        contract: core_1.Application.getContract("PostsTagsContract"),
        schema: http_1.RouterSchema.GetAll,
        summary: "Returns Posts Tags records by filter",
        exposeFilters: true,
        exclude: true
    }),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Queries)()),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getTags", null);
__decorate([
    (0, http_1.Get)("posts/tags/:slug", {
        contract: core_1.Application.getContract("PostsTagsContract"),
        schema: http_1.RouterSchema.GetByID,
        summary: "Returns Posts Tags record by slug",
        exposeFilters: true,
        exclude: true
    }),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)("slug")),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPostsByTagSlug", null);
__decorate([
    (0, http_1.Post)("posts", { exclude: true }),
    (0, auth_1.Auth)("post:insert"),
    __param(0, (0, http_1.Body)()),
    __param(1, (0, http_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "savePost", null);
__decorate([
    (0, http_1.Post)("pages", { exclude: true }),
    (0, auth_1.Auth)("pages:insert"),
    __param(0, (0, http_1.Body)()),
    __param(1, (0, http_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "savePage", null);
exports.PostsController = PostsController = __decorate([
    (0, http_1.Controller)('blog'),
    __metadata("design:paramtypes", [posts_service_1.PostsPublicService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map
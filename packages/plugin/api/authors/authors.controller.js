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
exports.AuthorsController = void 0;
const auth_1 = require("@cmmv/auth");
const http_1 = require("@cmmv/http");
const authors_service_1 = require("./authors.service");
let AuthorsController = class AuthorsController {
    authorsService;
    constructor(authorsService) {
        this.authorsService = authorsService;
    }
    async getAll(queries) {
        return this.authorsService.getAll(queries);
    }
    async create(body) {
        return this.authorsService.createAuthor(body);
    }
    async update(id, body) {
        return this.authorsService.updateAuthor(id, body);
    }
    async delete(id) {
        return this.authorsService.deleteAuthor(id);
    }
    async getAuthorById(id, res) {
        const author = await this.authorsService.getAuthorById(id);
        if (!author)
            throw new http_1.HttpException("Author not found", http_1.HttpStatus.NOT_FOUND);
        return author;
    }
    async getAuthorBySlug(slug, res) {
        const author = await this.authorsService.getAuthorBySlug(slug);
        if (!author)
            throw new http_1.HttpException("Author not found", http_1.HttpStatus.NOT_FOUND);
        return author;
    }
};
exports.AuthorsController = AuthorsController;
__decorate([
    (0, http_1.Get)(),
    (0, auth_1.Auth)({ rootOnly: true }),
    __param(0, (0, http_1.Queries)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthorsController.prototype, "getAll", null);
__decorate([
    (0, http_1.Post)(),
    (0, auth_1.Auth)({ rootOnly: true }),
    __param(0, (0, http_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthorsController.prototype, "create", null);
__decorate([
    (0, http_1.Put)(':id'),
    (0, auth_1.Auth)({ rootOnly: true }),
    __param(0, (0, http_1.Param)('id')),
    __param(1, (0, http_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthorsController.prototype, "update", null);
__decorate([
    (0, http_1.Delete)(':id'),
    (0, auth_1.Auth)({ rootOnly: true }),
    __param(0, (0, http_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthorsController.prototype, "delete", null);
__decorate([
    (0, http_1.Get)(':id'),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)('id')),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthorsController.prototype, "getAuthorById", null);
__decorate([
    (0, http_1.Get)('slug/:slug'),
    (0, http_1.CacheControl)({ maxAge: 3600, public: true }),
    (0, http_1.ContentType)('application/json'),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Param)('slug')),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthorsController.prototype, "getAuthorBySlug", null);
exports.AuthorsController = AuthorsController = __decorate([
    (0, http_1.Controller)('authors'),
    __metadata("design:paramtypes", [authors_service_1.AuthorsService])
], AuthorsController);
//# sourceMappingURL=authors.controller.js.map
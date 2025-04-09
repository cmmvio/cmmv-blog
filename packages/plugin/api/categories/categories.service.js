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
exports.CategoriesPublicService = void 0;
const core_1 = require("@cmmv/core");
const repository_1 = require("@cmmv/repository");
const posts_service_1 = require("../posts/posts.service");
let CategoriesPublicService = class CategoriesPublicService {
    postsService;
    constructor(postsService) {
        this.postsService = postsService;
    }
    async getAll(queries, req) {
        const CategoriesEntity = repository_1.Repository.getEntity("CategoriesEntity");
        const categories = await repository_1.Repository.findAll(CategoriesEntity, {
            limit: 1000,
            active: true
        }, [], {
            select: ["id", "name", "slug", "parentCategory", "active", "navigationLabel", "postCount"]
        });
        return (categories) ? JSON.stringify(categories.data) : [];
    }
    async getBySlug(slug) {
        const CategoriesEntity = repository_1.Repository.getEntity("CategoriesEntity");
        const category = await repository_1.Repository.findOne(CategoriesEntity, repository_1.Repository.queryBuilder({
            slug
        }), { select: ["id"] });
        if (!category)
            throw new Error("Category not found");
        return this.getById(category.id);
    }
    async getById(id) {
        const CategoriesEntity = repository_1.Repository.getEntity("CategoriesEntity");
        const category = await repository_1.Repository.findOne(CategoriesEntity, repository_1.Repository.queryBuilder({
            id
        }), {
            select: ["id", "name", "slug", "parentCategory", "active", "navigationLabel", "postCount", "description"]
        });
        const posts = await this.postsService.getPostsByCategory(id);
        return {
            category: category,
            posts: posts
        };
    }
};
exports.CategoriesPublicService = CategoriesPublicService;
exports.CategoriesPublicService = CategoriesPublicService = __decorate([
    (0, core_1.Service)('blog_categories_public'),
    __metadata("design:paramtypes", [posts_service_1.PostsPublicService])
], CategoriesPublicService);
//# sourceMappingURL=categories.service.js.map
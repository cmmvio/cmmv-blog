import {
    Controller, Get, RouterSchema,
    Queries, Req, Param,
    CacheControl, ContentType, Raw
} from "@cmmv/http";

import {
    Application
} from "@cmmv/core";

import {
    CategoriesPublicService
} from "./categories.service";

@Controller("blog")
export class CategoriesPublicController {
    constructor(private readonly categoriesPublicService: CategoriesPublicService){}

    @Get("categories", {
        contract: Application.getContract("CategoriesContract"),
        schema: RouterSchema.GetAll,
        summary: "Returns all categories",
        exposeFilters: true,
        exclude: true
    })
    @CacheControl({ maxAge: 3600, public: true })
    @ContentType('application/json')
    @Raw()
    async get(@Queries() queries: any, @Req() req: any) {
        return await this.categoriesPublicService.getAll(queries, req);
    }

    @Get("categories/slug/:slug", {
        contract: Application.getContract("CategoriesContract"),
        schema: RouterSchema.GetByID,
        summary: "Returns a category by slug",
        exposeFilters: true,
        exclude: true
    })
    @CacheControl({ maxAge: 3600, public: true })
    @ContentType('application/json')
    @Raw()
    async getBySlug(@Param("slug") slug: string, @Queries() queries: any) {
        return await this.categoriesPublicService.getBySlug(slug, queries);
    }

    @Get("categories/:id", {
        contract: Application.getContract("CategoriesContract"),
        schema: RouterSchema.GetByID,
        summary: "Returns a category by id",
        exposeFilters: true,
        exclude: true
    })
    @CacheControl({ maxAge: 3600, public: true })
    @ContentType('application/json')
    @Raw()
    async getById(@Param("id") id: string, @Queries() queries: any) {
        return await this.categoriesPublicService.getById(id, queries);
    }
}

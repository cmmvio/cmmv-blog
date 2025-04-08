import {
    Controller, Get, RouterSchema,
    Queries, Req, Response, Param
} from "@cmmv/http";

import {
    Application
} from "@cmmv/core";

import {
    CategoriesPublicService
} from "./categories.service";

@Controller("blog")
export class CategoriesPublicController {
    constructor(
        private readonly categoriesPublicService: CategoriesPublicService
    ){ }

    @Get("categories", {
        contract: Application.getContract("CategoriesContract"),
        schema: RouterSchema.GetAll,
        summary: "Returns all categories",
        exposeFilters: true,
        exclude: true
    })
    async get(@Queries() queries: any, @Response() res: any, @Req() req: any) {
        const categories = await this.categoriesPublicService.getAll(queries, req);
        res.code(200).contentType("text/json").send(categories)
    }

    @Get("categories/slug/:slug", {
        contract: Application.getContract("CategoriesContract"),
        schema: RouterSchema.GetByID,
        summary: "Returns a category by slug",
        exposeFilters: true,
        exclude: true
    })
    async getBySlug(@Param("slug") slug: string, @Response() res: any) {
        const category = await this.categoriesPublicService.getBySlug(slug);
        res.code(200).json(category);
    }

    @Get("categories/:id", {
        contract: Application.getContract("CategoriesContract"),
        schema: RouterSchema.GetByID,
        summary: "Returns a category by id",
        exposeFilters: true,
        exclude: true
    })
    async getById(@Param("id") id: string, @Response() res: any) {
        const category = await this.categoriesPublicService.getById(id);
        res.code(200).json(category);
    }


}

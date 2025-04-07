import {
    Controller, Get, RouterSchema,
    Queries, Req, Response
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
}
